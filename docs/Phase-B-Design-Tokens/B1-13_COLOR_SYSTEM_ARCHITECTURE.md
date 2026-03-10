# B1-13: Color System Architecture

## Overview
Technical architecture and implementation strategy for the color system.

## Token Hierarchy

```
Color System (Base)
├── Primitive Colors (Raw hex values)
│   ├── Primary palette (Blues)
│   ├── Semantic palette (Success/Warning/Error)
│   └── Neutral palette (Grays)
├── Semantic Tokens (Meaningful names)
│   ├── --button-primary-bg
│   ├── --text-body
│   └── --border-neutral
└── Component Tokens (Component-specific)
    ├── .button-primary
    ├── .card
    └── .input
```

## CSS Variable Cascade

```css
/* Level 1: Primitive Colors (Rarely used directly) */
--color-primary-500: #4F46E5;

/* Level 2: Semantic Tokens (Component usage) */
--button-primary-bg: var(--color-primary-500);
--link-default: var(--color-primary-500);

/* Level 3: Component Styles (Applied to HTML) */
.button-primary {
  background-color: var(--button-primary-bg);
}
```

## File Organization

```
src/www/design-tokens.js
├── Primitive Colors
│   ├── Light theme
│   └── Dark theme
├── Semantic Tokens
│   ├── Button colors
│   ├── Text colors
│   ├── Border colors
│   └── Background colors
├── Component Tokens
│   ├── Button variants
│   ├── Form inputs
│   └── Cards
└── Export (for use in CSS)
```

## Implementation Strategy

### Step 1: Define CSS Variables in HTML/Head
```html
<style>
  :root {
    /* All color tokens here */
  }
</style>
```

### Step 2: Apply to Components
```css
.button {
  background-color: var(--button-primary-bg);
}
```

### Step 3: Toggle Theme
```javascript
document.documentElement.setAttribute('data-theme', 'dark');
```

## Dark Mode Implementation

### Strategy 1: CSS Media Query
```css
@media (prefers-color-scheme: dark) {
  :root {
    --button-primary-bg: var(--color-dark-primary-200);
  }
}
```

### Strategy 2: Data Attribute
```css
[data-theme='dark'] {
  --button-primary-bg: var(--color-dark-primary-200);
}
```

### Strategy 3: Class on HTML
```css
html.dark {
  --button-primary-bg: var(--color-dark-primary-200);
}
```

## Verification Checklist

- [ ] All colors in CSS variables
- [ ] No hardcoded hex values in components
- [ ] Dark theme has all light theme variables
- [ ] All contrast ratios ≥ 4.5:1
- [ ] All variables tested in browser DevTools
- [ ] All variables documented
- [ ] Fallback colors provided
- [ ] Performance (no calc() on color values)

## Browser Support

- ✓ Chrome 49+
- ✓ Firefox 31+
- ✓ Safari 9.1+
- ✓ Edge 15+
- ✓ Mobile browsers (iOS, Android)

## Performance Considerations

- CSS variables are performant (not recalculated on change)
- No JavaScript required for basic theming
- Dark mode uses `prefers-color-scheme` media query
- Optional theme switcher uses data attributes or classes

## Maintenance

1. Update colors in design-tokens.js
2. Run color contrast validation
3. Test in light and dark mode
4. Update CHANGELOG
5. Commit changes

---
**Status**: ✓ Complete | **Phase**: B1 | **Date**: 2026-03-10
