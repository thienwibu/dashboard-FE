const API_BASE_URL = 'http://localhost:3001/api';

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

// Read CSRF token from cookie (double submit)
const getCsrfToken = () => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
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
    const response = await fetch(`${API_BASE_URL}/auth/csrf-token`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch CSRF token');
    }
    
    const data = await response.json();
    // CSRF token is set in cookie by server, but we also get it in response
    csrfTokenFetched = true;
    return data.data?.csrf_token || getCsrfToken();
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return null;
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
      console.log('🔄 Using temp access token from sessionStorage for refresh');
      console.log('🔍 temp_access_token exists in sessionStorage:', currentAccessToken.substring(0, 20) + '...');
      setAccessToken(currentAccessToken); // Restore to memory
    } else {
      console.log('❌ temp_access_token NOT found in sessionStorage');
    }
  }
  
  if (!currentAccessToken) {
    throw new Error('No access token available for refresh');
  }
  
  // Ensure we have CSRF token before refreshing
  let csrfToken = getCsrfToken();
  if (!csrfToken) {
    csrfToken = await fetchCsrfToken();
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentAccessToken}`, // Always send access token (even if expired) for verification
      ...(csrfToken ? { 'x-csrf-token': csrfToken } : {})
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
  console.log('💾 Saving new access token to memory and sessionStorage (temp_access_token)');
  sessionStorage.setItem('temp_access_token', newAccess);
  console.log('✅ New access token saved after refresh');
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
    
    // Log for debugging
    if (basePath === '/auth/verify-reset-token') {
      console.log('🔍 Public endpoint detected, skipping auth:', basePath);
    }

    let currentAccessToken = getAccessToken();
    
    // If not in memory, try to restore from sessionStorage first
    if (!currentAccessToken) {
      const tempAccessToken = sessionStorage.getItem('temp_access_token');
      if (tempAccessToken) {
        console.log('🔄 Restoring access token from sessionStorage to memory');
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
    
    // Log token status for debugging
    if (requiresAuth && endpoint !== '/auth/refresh-token') {
      console.log('🔍 Token check for', endpoint, {
        tokenExists,
        tokenValid,
        tokenExpiryInfo
      });
    }
    
    // Only refresh if token is missing OR expired
    // Note: refresh-token endpoint itself requires access token (even if expired), so skip auto-refresh for it
    // Also skip refresh for public endpoints that don't need authentication
    if (requiresAuth && endpoint !== '/auth/refresh-token' && (!tokenExists || !tokenValid)) {
      if (!tokenExists) {
        console.log('⚠️ Access token missing, attempting refresh...');
      } else if (!tokenValid) {
        console.log('⚠️ Access token expired, attempting refresh...', tokenExpiryInfo);
      }
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
    // Always include CSRF token for authenticated requests and sensitive public endpoints
    // For public endpoints like login/register, CSRF is optional but recommended
    let csrfToken = getCsrfToken();
    const publicEndpointsWithoutCsrf = [
      '/auth/login', 
      '/auth/register', 
      '/auth/csrf-token',
      '/auth/verify-reset-token' // Public endpoint, doesn't need CSRF token
    ];
    
    // Use basePath for comparison (remove query string)
    const needsCsrf = !publicEndpointsWithoutCsrf.includes(basePath);
    
    // If endpoint needs CSRF token but we don't have it, fetch it first
    if (needsCsrf && !csrfToken) {
      console.log('🔒 CSRF token missing for', basePath, '- fetching...');
      csrfToken = await fetchCsrfToken();
      if (!csrfToken) {
        console.warn('⚠️ Failed to fetch CSRF token for', basePath);
      } else {
        console.log('✅ CSRF token fetched successfully');
      }
    }
    
    // Always add CSRF token to header if we have it and endpoint needs it
    if (csrfToken && needsCsrf) {
      headers['x-csrf-token'] = csrfToken;
    }

    // Log request for verify-reset-token debugging
    if (endpoint.includes('/auth/verify-reset-token')) {
      console.log('🌐 Making API call to:', `${API_BASE_URL}${endpoint}`);
      console.log('📤 Request headers:', headers);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      credentials: options.credentials || 'include',
      ...options,
    });

    // Log response status for verify-reset-token debugging
    if (endpoint.includes('/auth/verify-reset-token')) {
      console.log('📥 Response status:', response.status, response.statusText);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
    }

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
    
    // Log response for debugging (only for verify-reset-token)
    if (endpoint.includes('/auth/verify-reset-token')) {
      console.log('✅ Verify reset token response:', data);
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
      // Log error details for debugging
      console.error(`API Error for ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        data
      });
      throw new Error(data.message || data.error || `Server error: ${response.status} ${response.statusText}`);
    }

    // Log successful response for verify-reset-token
    if (endpoint.includes('/auth/verify-reset-token')) {
      console.log('✅ Verify reset token response:', data);
    }
    
    // Log successful response for login
    if (endpoint.includes('/auth/login')) {
      console.log('✅ Login API response data:', data);
    }

    return data;
  } catch (error) {
    // Log error for debugging
    if (endpoint.includes('/auth/verify-reset-token')) {
      console.error('❌ Error in verify-reset-token:', error);
    }
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
    console.log('🔐 Calling login API...');
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    console.log('✅ Login API response:', response);
    return response;
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
  fetchCsrfToken,
};

