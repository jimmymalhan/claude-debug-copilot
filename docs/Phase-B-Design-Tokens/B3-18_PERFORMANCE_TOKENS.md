# B3-18: Performance & Optimization Tokens

## Overview
Performance-related tokens and optimization guidelines.

## Will-Change

### GPU Acceleration
```css
.will-change-transform {
  will-change: transform;
}

.will-change-opacity {
  will-change: opacity;
}

/* Use sparingly */
.animate {
  will-change: transform, opacity;
  animation: fadeSlide 300ms ease-out;
}
```

## Transform for Animation

### Prefer Transform
```css
/* ✅ Good: Uses GPU */
.animate {
  transform: translateY(10px) scale(0.95);
  opacity: 0;
}
```

### Avoid Layout Properties
```css
/* ❌ Bad: Causes layout recalc */
.animate {
  top: 10px;
  width: 100px;
}
```

## Contain

### Layout Containment
```css
.card {
  contain: layout style paint;
  /* Tells browser: this element doesn't affect outside */
}
```

## Backface Visibility

### Prevent Flicker
```css
.smooth-animation {
  backface-visibility: hidden;
  perspective: 1000px;
}
```

## Font Display

### System Fonts (No Loading)
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  /* Already on device, 0ms load */
}
```

### Web Font Strategy
```css
@font-face {
  font-family: 'Custom';
  src: url('font.woff2') format('woff2');
  font-display: swap;  /* Show fallback first, swap when ready */
}
```

## Image Optimization

### Lazy Loading
```html
<img src="image.jpg" loading="lazy" alt="Description">
```

### Responsive Images
```html
<img srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1200w"
     sizes="(max-width: 480px) 100vw, (max-width: 768px) 80vw, 50vw"
     alt="Description">
```

## Bundle Size

### Only Load What You Need
- Use CSS variables (no extra bytes)
- Don't load unused fonts
- Minify CSS before production
- Remove unused utilities

---
**Status**: ✓ Complete | **Phase**: B3 | **Date**: 2026-03-10
