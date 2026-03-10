# B2-02: Typographic Scale & Sizing

## Overview
Modular typographic scale based on mathematical ratios for consistent sizing.

## Font Size Scale

### 1.125x Scale (Minor Third)
```css
--font-size-xs: 12px;    /* 16 / 1.125 / 1.125 = 12 */
--font-size-sm: 14px;    /* 16 / 1.125 = 14 */
--font-size-base: 16px;  /* Base size */
--font-size-lg: 18px;    /* 16 × 1.125 = 18 */
--font-size-xl: 20px;    /* 16 × 1.125 × 1.125 = 20 */
--font-size-2xl: 24px;   /* 16 × 1.5 = 24 */
--font-size-3xl: 30px;   /* 16 × 1.875 = 30 */
--font-size-4xl: 36px;   /* 16 × 2.25 = 36 */
```

## Heading Sizes

### H1 (Display)
```css
font-size: var(--font-size-4xl);    /* 36px */
font-weight: var(--font-weight-bold); /* 700 */
line-height: 1.2;
letter-spacing: -0.02em;
```

### H2 (Large Heading)
```css
font-size: var(--font-size-3xl);    /* 30px */
font-weight: var(--font-weight-bold);
line-height: 1.3;
```

### H3 (Medium Heading)
```css
font-size: var(--font-size-2xl);    /* 24px */
font-weight: var(--font-weight-semibold);
line-height: 1.4;
```

### H4 (Small Heading)
```css
font-size: var(--font-size-xl);     /* 20px */
font-weight: var(--font-weight-semibold);
line-height: 1.5;
```

### H5 & H6
```css
font-size: var(--font-size-lg);     /* 18px */
font-weight: var(--font-weight-semibold);
line-height: 1.5;
```

## Body Text

### Large Body
```css
font-size: var(--font-size-lg);     /* 18px */
font-weight: var(--font-weight-normal);
line-height: 1.5;
```

### Regular Body
```css
font-size: var(--font-size-base);   /* 16px */
font-weight: var(--font-weight-normal);
line-height: 1.5;
```

### Small Body
```css
font-size: var(--font-size-sm);     /* 14px */
font-weight: var(--font-weight-normal);
line-height: 1.6;
```

### Extra Small
```css
font-size: var(--font-size-xs);     /* 12px */
font-weight: var(--font-weight-normal);
line-height: 1.7;
```

## Line Length Optimization

### Optimal Line Length
```css
max-width: 65ch;  /* 65 characters per line */
```

### For Different Sizes
```css
/* Large text */
h1 { max-width: 45ch; }

/* Body text */
p { max-width: 65ch; }

/* Small text */
small { max-width: 80ch; }
```

## CSS Variables
```css
:root {
  /* Font Sizes */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 30px;
  --font-size-4xl: 36px;

  /* Scale Factor */
  --scale-factor: 1.125;
}
```

## Responsive Scaling

### Mobile Adjustment
```css
@media (max-width: 640px) {
  :root {
    --font-size-base: 15px;    /* Slightly smaller on mobile */
    --font-size-2xl: 20px;
    --font-size-4xl: 28px;
  }
}
```

## Readability Standards
- Minimum font size: 12px (body text minimum)
- Maximum line length: 80 characters
- Line height minimum: 1.5 for body text
- Letter spacing: -0.02em for headings

---
**Status**: ✓ Complete | **Phase**: B2 | **Date**: 2026-03-10
