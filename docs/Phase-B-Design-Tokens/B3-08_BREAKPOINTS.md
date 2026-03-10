# B3-08: Responsive Breakpoints

## Overview
Standard screen size breakpoints for responsive design.

## Breakpoint Scale

### Mobile (< 640px)
```css
--breakpoint-sm: 640px;
```
Usage: Small phones, portrait orientation

### Tablet (≥ 640px)
```css
--breakpoint-md: 768px;
```
Usage: Tablets, landscape phones

### Small Desktop (≥ 1024px)
```css
--breakpoint-lg: 1024px;
```
Usage: Laptops, small desktops

### Large Desktop (≥ 1280px)
```css
--breakpoint-xl: 1280px;
```
Usage: Large monitors, TV screens

## Media Query Patterns

### Mobile First
```css
/* Base styles (mobile) */
.element { width: 100%; }

/* Tablet and up */
@media (min-width: 640px) {
  .element { width: 50%; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .element { width: 33.333%; }
}
```

### Desktop First (Not recommended)
```css
/* Large screens */
.element { width: 33.333%; }

/* Smaller screens */
@media (max-width: 1024px) {
  .element { width: 50%; }
}

@media (max-width: 640px) {
  .element { width: 100%; }
}
```

## CSS Variables
```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

## Sizing per Breakpoint

### Mobile (< 640px)
- Full width layouts
- Single column
- Stacked navigation
- Large touch targets

### Tablet (640px - 1024px)
- Two column layouts
- Side-by-side navigation
- Optimized spacing

### Desktop (1024px+)
- Three column layouts
- Horizontal navigation
- Optimal line lengths

## Common Breakpoints

| Device | Width | Breakpoint |
|--------|-------|-----------|
| Mobile (small) | 360px | < 640px |
| Mobile (large) | 430px | < 640px |
| Tablet | 768px | 640px - 1024px |
| Desktop | 1200px | 1024px+ |
| Large Desktop | 1920px | 1280px+ |

## Testing at Breakpoints
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1200px)
- [ ] Large desktop (1920px)
- [ ] In-between sizes (640px, 1024px)

---
**Status**: ✓ Complete | **Phase**: B3 | **Date**: 2026-03-10
