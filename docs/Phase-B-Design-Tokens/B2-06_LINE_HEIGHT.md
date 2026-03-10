# B2-06: Line Height & Vertical Rhythm

## Overview
Line height strategy for readability and visual spacing.

## Line Height Scale

### Tight (1.2)
```css
--line-height-tight: 1.2;
```
Usage: Headings, display text, compact spaces

### Normal (1.5)
```css
--line-height-normal: 1.5;
```
Usage: Body text, paragraphs, standard content

### Relaxed (1.75)
```css
--line-height-relaxed: 1.75;
```
Usage: Dense text blocks, improved readability

### Loose (2)
```css
--line-height-loose: 2;
```
Usage: Large text, accessibility, special emphasis

## Line Height by Context

### Headings
```css
h1 { line-height: 1.1; }  /* Extra tight */
h2 { line-height: 1.2; }
h3 { line-height: 1.3; }
h4, h5, h6 { line-height: 1.4; }
```

### Body Text
```css
p { line-height: 1.5; }
.lead { line-height: 1.5; }
.small { line-height: 1.6; }
```

### Accessibility
```css
/* Better for users with dyslexia */
.accessible-text { line-height: 1.75; }
```

## Readability Standards

### Optimal Line Height
| Text Size | Line Height | Usage |
|-----------|------------|-------|
| 12px | 1.7 | Small text |
| 14px | 1.6 | Small body |
| 16px | 1.5 | Standard body |
| 18px | 1.5 | Large body |
| 24px | 1.3 | Heading |
| 36px | 1.1 | Large heading |

## Vertical Rhythm

### Baseline Grid
```css
:root {
  --baseline: 4px;  /* Grid unit */
  --line-height: 1.5;
  --font-size: 16px;
  --base-spacing: calc(var(--font-size) * var(--line-height));
}
```

### Consistent Spacing
```css
p { margin-bottom: 1.5rem; }     /* One line height */
h2 { margin-bottom: 1rem; }      /* Consistent spacing */
h3 { margin-bottom: 0.75rem; }
```

## Letter Spacing Impact on Line Height

### Normal Text
```css
letter-spacing: 0;
line-height: 1.5;
```

### Wide Letter Spacing
```css
letter-spacing: 0.05em;
line-height: 1.6;  /* Increase to compensate */
```

## CSS Variables
```css
:root {
  /* Line Heights */
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  --line-height-loose: 2;

  /* Base spacing (derived) */
  --space-sm: 0.5rem;   /* Half line height */
  --space-md: 1rem;     /* One line height */
  --space-lg: 1.5rem;   /* 1.5 line heights */
}
```

## Accessibility Considerations
- Minimum line height: 1.5 for body text (WCAG AAA)
- Wider spacing for users with dyslexia
- Test with `prefers-reduced-motion` respected

## Testing Readability
- Print at 16px: Should be comfortable to read
- Mobile at 14px: Should not feel cramped
- Headings: Should not have excessive space

---
**Status**: ✓ Complete | **Phase**: B2 | **Date**: 2026-03-10
