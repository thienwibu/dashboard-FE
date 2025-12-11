const API_BASE_URL = 'https://api.shopsheap.online/api';

// In-memory access token (clears when tab closes/reloads)
let accessTokenMemory = null;

export const setAccessToken = (token) => {
  accessTokenMemory = token || null;
};

export const getAccessToken = () => accessTokenMemory;

export const clearAccessToken = () => {
  accessTokenMemory = null;
  // Also clear temp token from sessionStorage
  sessionStorage.removeItem('temp_access_token');
};

// Read CSRF token from cookie only (double submit cookie pattern)
const getCsrfToken = () => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  const token = match ? decodeURIComponent(match[1]) : null;
  if (token) {
    console.log('🍪 Reading CSRF token from cookie:', token.substring(0, 20) + '...');
  }
  return token;
};

// Flag to prevent multiple simultaneous CSRF token fetches
let csrfTokenFetching = false;
let csrfTokenFetched = false;

// Fetch CSRF token from server (only once per session)
export const fetchCsrfToken = async (force = false) => {
  // If already have token in cookie and not forcing, skip
  if (!force && getCsrfToken()) {
    return getCsrfToken();
  }
  
  // If already fetched or currently fetching, skip
  if (csrfTokenFetched || csrfTokenFetching) {
    return getCsrfToken();
  }
  
  csrfTokenFetching = true;
  
  try {
    console.log('🔄 Fetching CSRF token from:', `${API_BASE_URL}/auth/csrf-token`);
    const response = await fetch(`${API_BASE_URL}/auth/csrf-token`, {
      method: 'GET',
      credentials: 'include',
    });
    
    console.log('📥 CSRF token response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ CSRF token fetch failed:', response.status, response.statusText, errorText);
      throw new Error(`Failed to fetch CSRF token: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📥 CSRF token response data:', data);
    
    // Wait longer for cookie to be set by browser (especially for cross-origin)
    // Try multiple times to read from cookie
    let token = null;
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      token = getCsrfToken();
      if (token) {
        console.log(`✅ CSRF token found in cookie (attempt ${i + 1}):`, token.substring(0, 20) + '...');
        break;
      }
      console.log(`⏳ Waiting for cookie... (attempt ${i + 1}/5)`);
    }
    
    if (token) {
      csrfTokenFetched = true;
      // Verify token matches response (should match if cookie was set correctly)
      const responseToken = data.data?.csrf_token;
      if (responseToken && token !== responseToken) {
        console.error('❌ Cookie token does NOT match response token!');
        console.error('Cookie token:', token.substring(0, 20) + '...');
        console.error('Response token:', responseToken.substring(0, 20) + '...');
        console.error('⚠️ This means cookie was not updated. Using cookie token anyway.');
        // Still use cookie token (it's what browser will send)
      } else if (responseToken && token === responseToken) {
        console.log('✅ Cookie token matches response token');
      }
      return token;
    } else {
      console.error('❌ CSRF token not found in cookie after fetch');
      console.log('🔍 All cookies:', document.cookie);
      console.log('🔍 Response token:', data.data?.csrf_token?.substring(0, 20) + '...');
      throw new Error('CSRF token not found in cookie after fetch');
    }
  } catch (error) {
    console.error('❌ Error fetching CSRF token:', error);
    csrfTokenFetching = false;
    csrfTokenFetched = false; // Reset flag on error
    throw error; // Throw error instead of returning null
  } finally {
    csrfTokenFetching = false;
  }
};

// Hash password client-side before sending (SHA-256)
export const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Decode JWT token to get payload (without verification)
 * WARNING: This is client-side decoding only, backend always verifies
 */
export const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Refresh token helper (bypasses apiCall to avoid infinite loop)
 * Always sends current access token (even if expired) for security verification
 */
async function refreshAccessToken() {
  // Get current access token (even if expired) - required for security
  let currentAccessToken = getAccessToken();
  
  // If not in memory, try to get from sessionStorage (temporary storage after login)
  if (!currentAccessToken) {
    currentAccessToken = sessionStorage.getItem('temp_access_token');
    if (currentAccessToken) {
      setAccessToken(currentAccessToken); // Restore to memory
    }
  }
  
  if (!currentAccessToken) {
    throw new Error('No access token available for refresh');
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentAccessToken}` // Always send access token (even if expired) for verification
    },
    // Refresh token is stored in HTTP-only cookie
    credentials: 'include',
    body: JSON.stringify({}),
  });

  // Check if response is JSON before parsing
  const contentType = response.headers.get('content-type');
  let data;
  
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Error parsing refresh token JSON response:', jsonError);
      const text = await response.text();
      console.error('Refresh token response text:', text);
      throw new Error('Invalid JSON response from server');
    }
  } else {
    const text = await response.text();
    console.error('Refresh token non-JSON response:', text);
    throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
  }

  if (!response.ok) {
    throw new Error(data.message || 'Failed to refresh token');
  }

  const newAccess = data?.data?.access_token;
  if (!newAccess) {
    throw new Error('No access token returned from refresh');
  }

  // Save new access token to memory
  setAccessToken(newAccess);
  // Also update temp_access_token in sessionStorage with the new token
  // This ensures if page reloads, we still have a token to refresh
  sessionStorage.setItem('temp_access_token', newAccess);
  return data;
}

/**
 * Base API call function with automatic token refresh
 */
async function apiCall(endpoint, options = {}) {
  try {
    // Public endpoints that don't require authentication
    const skipAuthEndpoints = [
      '/auth/login', 
      '/auth/register',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/verify-reset-token',
      '/auth/csrf-token'
    ];
    // Note: /auth/refresh-token requires access token (even if expired) for security
    // Extract base path from endpoint (remove query string)
    const basePath = endpoint.split('?')[0];
    const requiresAuth = !skipAuthEndpoints.includes(basePath);

    let currentAccessToken = getAccessToken();
    
    // If not in memory, try to restore from sessionStorage first
    if (!currentAccessToken) {
      const tempAccessToken = sessionStorage.getItem('temp_access_token');
      if (tempAccessToken) {
        setAccessToken(tempAccessToken);
        currentAccessToken = tempAccessToken;
      }
    }

    // Check if token exists and is still valid
    const tokenExists = !!currentAccessToken;
    let tokenValid = false;
    let tokenExpiryInfo = null;
    
    if (currentAccessToken) {
      const decoded = decodeJWT(currentAccessToken);
      if (decoded && decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = decoded.exp - currentTime;
        tokenExpiryInfo = {
          expiresAt: new Date(decoded.exp * 1000).toISOString(),
          timeUntilExpiry: timeUntilExpiry,
          isExpired: decoded.exp < currentTime
        };
        tokenValid = !tokenExpiryInfo.isExpired;
      }
    }
    
    // Only refresh if token is missing OR expired
    // Note: refresh-token endpoint itself requires access token (even if expired), so skip auto-refresh for it
    // Also skip refresh for public endpoints that don't need authentication
    if (requiresAuth && endpoint !== '/auth/refresh-token' && (!tokenExists || !tokenValid)) {
      try {
        const refreshResponse = await refreshAccessToken();
        currentAccessToken = refreshResponse.data.access_token;
      } catch (refreshError) {
        // Only clear session and redirect if this is an authenticated endpoint
        // Public endpoints like verify-reset-token should not trigger redirect
        if (requiresAuth) {
          clearAccessToken();
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('dashboardType');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
        } else {
          // For public endpoints, just clear the token but don't redirect
          clearAccessToken();
          throw refreshError;
        }
      }
    }
    
    // For refresh-token endpoint, always send current access token (even if expired)
    if (endpoint === '/auth/refresh-token' && !currentAccessToken) {
      throw new Error('Access token is required for refresh');
    }
    
    // Add Authorization header if token exists
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (currentAccessToken) {
      headers['Authorization'] = `Bearer ${currentAccessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      credentials: options.credentials || 'include',
      ...options,
    });

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
    try {
        data = await response.json();
      } catch (jsonError) {
        const text = await response.text();
        console.error('Error parsing JSON response:', jsonError);
        console.error('Response text:', text);
        throw new Error('Invalid JSON response from server');
      }
    } else {
      // If not JSON, get text response
      const text = await response.text();
      console.error(`Non-JSON response for ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        contentType,
        text: text.substring(0, 200)
      });
      throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
    }

    // If still 401 after refresh, try once more with the new token
    if (response.status === 401 && requiresAuth) {
      try {
        const refreshResponse = await refreshAccessToken();
        const retryToken = refreshResponse.data.access_token;
        headers['Authorization'] = `Bearer ${retryToken}`;
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers,
          credentials: options.credentials || 'include',
          ...options,
        });
        
        // Check if retry response is JSON
        const retryContentType = retryResponse.headers.get('content-type');
        let retryData;
        
        if (retryContentType && retryContentType.includes('application/json')) {
          retryData = await retryResponse.json();
        } else {
          const retryText = await retryResponse.text();
          throw new Error('Invalid JSON response from server');
        }
        
        if (!retryResponse.ok) {
          throw new Error(retryData.message || 'Something went wrong');
        }
        
        return retryData;
      } catch (refreshError) {
        clearAccessToken();
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('dashboardType');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `Server error: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Authentication API calls
 */
export const authAPI = {
  // Register
  register: async (userData) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login
  login: async (credentials) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Get current user
  getCurrentUser: async () => {
    // Token is automatically added by apiCall from sessionStorage
    return apiCall('/auth/me', {
      method: 'GET',
    });
  },

  // Logout
  logout: async () => {
    // Token is automatically added by apiCall from sessionStorage
    return apiCall('/auth/logout', {
      method: 'POST',
    });
  },

  // Forgot password
  forgotPassword: async (email) => {
    return apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Verify reset token
  verifyResetToken: async (token) => {
    // Encode token in URL to handle special characters
    const encodedToken = encodeURIComponent(token);
    return apiCall(`/auth/verify-reset-token?token=${encodedToken}`, {
      method: 'GET',
    });
  },

  // Reset password
  resetPassword: async (data) => {
    return apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Refresh token
  refreshToken: async () => {
    return apiCall('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },
};

export default {
  authAPI,
  decodeJWT,
  isTokenExpired,
  setAccessToken,
  getAccessToken,
  clearAccessToken,
  hashPassword,
};

