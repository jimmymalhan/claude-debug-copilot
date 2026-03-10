# B2-05: Font Weights & Weight Hierarchy

## Overview
Font weight strategy for visual hierarchy and emphasis.

## Weight Scale

### Light (300)
```css
--font-weight-light: 300;
```
Usage: Subtext, disabled states, low emphasis

### Normal (400)
```css
--font-weight-normal: 400;
```
Usage: Body text, default paragraphs, general content

### Medium (500)
```css
--font-weight-medium: 500;
```
Usage: Labels, slightly emphasized text, secondary headings

### Semibold (600)
```css
--font-weight-semibold: 600;
```
Usage: Subheadings, form labels, emphasis

### Bold (700)
```css
--font-weight-bold: 700;
```
Usage: Headings, strong emphasis, important text

### Extrabold (800)
```css
--font-weight-extrabold: 800;
```
Usage: Hero text, display headings, maximum emphasis

## Weight by Context

### Headings
```css
h1 { font-weight: var(--font-weight-bold); }           /* 700 */
h2 { font-weight: var(--font-weight-bold); }           /* 700 */
h3 { font-weight: var(--font-weight-semibold); }       /* 600 */
h4 { font-weight: var(--font-weight-semibold); }       /* 600 */
h5, h6 { font-weight: var(--font-weight-semibold); }   /* 600 */
```

### Body Text
```css
p { font-weight: var(--font-weight-normal); }          /* 400 */
.lead { font-weight: var(--font-weight-normal); }      /* 400 */
.small { font-weight: var(--font-weight-normal); }     /* 400 */
```

### Emphasis
```css
strong, b { font-weight: var(--font-weight-semibold); } /* 600 */
em { font-weight: var(--font-weight-normal); }          /* 400 */
```

### UI Elements
```css
.button { font-weight: var(--font-weight-medium); }     /* 500 */
.label { font-weight: var(--font-weight-medium); }      /* 500 */
.badge { font-weight: var(--font-weight-semibold); }    /* 600 */
```

## Weight Combinations

### Hierarchy Example
```
36px Bold        ← H1 (700)
24px Semibold    ← H3 (600)
16px Normal      ← P (400)
14px Medium      ← Label (500)
12px Light       ← Disabled (300)
```

## Performance Considerations

### Font File Size
| Weight | File Size | Impact |
|--------|-----------|--------|
| 300 (Light) | +20KB | Slight |
| 400 (Normal) | +20KB | Baseline |
| 500 (Medium) | +20KB | Slight |
| 600 (Semibold) | +20KB | Slight |
| 700 (Bold) | +20KB | Slight |
| 800 (Extrabold) | +20KB | Slight |

### Load Strategy
```css
/* Load only necessary weights */
@font-face {
  font-family: 'Inter';
  src: url('inter-400.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('inter-600.woff2') format('woff2');
  font-weight: 600;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('inter-700.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}
```

## CSS Variables
```css
:root {
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
}
```

## Readability Impact
- Lighter weights (300): Better for large text
- Normal weight (400): Best for body text
- Heavier weights (600+): Better for headings
- Very heavy (800+): Only for display/hero

## Browser Support
- ✓ All weights supported in all modern browsers
- ✓ System fonts support 400, 700 minimum
- ✓ Web fonts can load specific weights

---
**Status**: ✓ Complete | **Phase**: B2 | **Date**: 2026-03-10
