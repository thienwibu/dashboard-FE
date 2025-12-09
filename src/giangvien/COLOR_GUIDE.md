# Giảng Viên Dashboard - Color Guide

## Theme Colors

### Primary Color - Deep Blue (#3F51B5)
Sử dụng cho:
- Header background
- Primary buttons
- Active navigation items
- Links
- Main brand elements

**Tailwind Classes:**
- `bg-primary-500` - Background
- `text-primary-500` - Text
- `border-primary-500` - Border
- `hover:bg-primary-600` - Hover state

### Accent Color - Orange (#FF9800)
Sử dụng cho:
- Call-to-action buttons
- Important highlights
- Active indicators
- Key metrics
- Notifications badges

**Tailwind Classes:**
- `bg-accent-500` - Background
- `text-accent-500` - Text
- `border-accent-500` - Border
- `hover:bg-accent-600` - Hover state

### Background Color - Light Gray (#F0F2F5)
Sử dụng cho:
- Main page background
- Card backgrounds (white)
- Section separators

**CSS Variable:**
- `background-color: var(--gv-bg-main)`

### Font Family - PT Sans
Sử dụng cho tất cả text trong dashboard giảng viên

**CSS:**
```css
font-family: 'PT Sans', sans-serif;
```

## Component Examples

### Buttons

#### Primary Button
```jsx
<button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg">
  Primary Action
</button>
```

#### Accent Button
```jsx
<button className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg">
  Important Action
</button>
```

### Cards
```jsx
<div className="bg-white rounded-lg shadow-soft p-6 border border-gray-200">
  Card Content
</div>
```

### Navigation Items
```jsx
<a className="sidebar-item text-gray-700 hover:bg-primary-50 hover:text-primary-700">
  Menu Item
</a>

<a className="sidebar-item active bg-primary-50 text-primary-700 border-l-4 border-accent-500">
  Active Menu Item
</a>
```

### Metrics/KPI Cards
```jsx
<div className="metric-card bg-gradient-to-br from-primary-500 to-primary-700 text-white p-6 rounded-lg">
  <h3>Metric Title</h3>
  <p className="text-3xl font-bold">1,234</p>
</div>

<div className="metric-accent bg-gradient-to-br from-accent-500 to-accent-700 text-white p-6 rounded-lg">
  <h3>Important Metric</h3>
  <p className="text-3xl font-bold">567</p>
</div>
```

### Status Badges
```jsx
<span className="badge-success px-3 py-1 rounded-full text-sm">Success</span>
<span className="badge-warning px-3 py-1 rounded-full text-sm">Warning</span>
<span className="badge-error px-3 py-1 rounded-full text-sm">Error</span>
```

## CSS Variables Available

```css
--gv-primary: #3F51B5
--gv-primary-dark: #303F9F
--gv-primary-light: #7986CB
--gv-bg-main: #F0F2F5
--gv-bg-white: #FFFFFF
--gv-accent: #FF9800
--gv-accent-dark: #F57C00
--gv-accent-light: #FFB74D
--gv-text-primary: #212121
--gv-text-secondary: #757575
--gv-font-family: 'PT Sans', sans-serif
```

## Migration Tips

1. Replace `bg-blue-600` with `bg-primary-500`
2. Replace `bg-indigo-600` with `bg-primary-500`
3. Replace `bg-orange-500` with `bg-accent-500`
4. Replace `bg-gray-50` with `bg-gray-50` (keep as is)
5. Add `giangvien-dashboard` class to root container
6. Import `../../theme.css` in Layout component
