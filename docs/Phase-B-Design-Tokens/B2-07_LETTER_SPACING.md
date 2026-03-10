# B2-07: Letter Spacing & Tracking

## Overview
Letter spacing strategy for different text contexts and readability.

## Letter Spacing Scale

### Tight (-0.02em)
```css
--letter-spacing-tight: -0.02em;
```
Usage: Headings, display text, design impact

### Normal (0em)
```css
--letter-spacing-normal: 0em;
```
Usage: Body text, default, no adjustment

### Wide (0.05em)
```css
--letter-spacing-wide: 0.05em;
```
Usage: Labels, all-caps text, emphasis

### Wider (0.1em)
```css
--letter-spacing-wider: 0.1em;
```
Usage: Special headings, decorative text

## Spacing by Context

### Headings (Negative Spacing)
```css
h1 { letter-spacing: -0.02em; }  /* Tighter */
h2 { letter-spacing: -0.01em; }
h3, h4, h5, h6 { letter-spacing: 0em; }
```

### Body Text (Normal)
```css
p { letter-spacing: 0em; }
body { letter-spacing: 0em; }
```

### UI Elements (Wide)
```css
button { letter-spacing: 0.02em; }
label { letter-spacing: 0.02em; }
.uppercase { letter-spacing: 0.05em; }
```

### All-Caps Text (Very Wide)
```css
.all-caps {
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

## Readability Impact

### Tight Spacing
```css
/* More compact, looks bold */
h1 { letter-spacing: -0.02em; }
```

### Normal Spacing
```css
/* Balanced, easy to read */
p { letter-spacing: 0em; }
```

### Wide Spacing
```css
/* Better for CAPS, labels, emphasis */
.label { letter-spacing: 0.05em; }
```

## Combinations with Line Height

### Dense Text (Tight)
```css
letter-spacing: -0.01em;
line-height: 1.2;
```

### Open Text (Wide)
```css
letter-spacing: 0.05em;
line-height: 1.75;
```

## CSS Variables
```css
:root {
  /* Letter Spacing */
  --letter-spacing-tight: -0.02em;
  --letter-spacing-normal: 0em;
  --letter-spacing-wide: 0.05em;
  --letter-spacing-wider: 0.1em;
}
```

## Performance
- CSS property: No performance impact
- Applied to text elements only
- No additional HTTP requests
- Rendering cost: Negligible

## Accessibility Considerations
- Avoid excessive spacing (>0.12em)
- Wide spacing can hurt readability if too much
- Test with actual fonts at actual sizes
- Verify against color contrast requirements

## Real-world Examples

### Hero Heading
```css
h1 {
  font-size: 48px;
  letter-spacing: -0.03em;
  line-height: 1.1;
}
```

### Button
```css
button {
  font-size: 14px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
```

### Paragraph
```css
p {
  font-size: 16px;
  letter-spacing: 0em;
  line-height: 1.5;
}
```

---
**Status**: ✓ Complete | **Phase**: B2 | **Date**: 2026-03-10
