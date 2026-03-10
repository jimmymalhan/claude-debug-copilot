# B2-03: Heading Styles & Hierarchy

## Overview
Complete heading hierarchy (H1-H6) with semantic meaning and styling.

## Heading Hierarchy

### H1 (Page Title)
```css
h1 {
  font-size: var(--font-size-4xl);      /* 36px */
  font-weight: var(--font-weight-bold); /* 700 */
  line-height: var(--line-height-tight); /* 1.2 */
  letter-spacing: -0.02em;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--text-heading-primary);
}
```

### H2 (Section Title)
```css
h2 {
  font-size: var(--font-size-3xl);        /* 30px */
  font-weight: var(--font-weight-bold);   /* 700 */
  line-height: var(--line-height-tight);  /* 1.3 */
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--text-heading-primary);
}
```

### H3 (Subsection)
```css
h3 {
  font-size: var(--font-size-2xl);        /* 24px */
  font-weight: var(--font-weight-semibold); /* 600 */
  line-height: 1.4;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--text-heading-secondary);
}
```

### H4 (Minor Heading)
```css
h4 {
  font-size: var(--font-size-xl);         /* 20px */
  font-weight: var(--font-weight-semibold);
  line-height: 1.5;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: var(--text-heading-secondary);
}
```

### H5 & H6 (Tertiary)
```css
h5, h6 {
  font-size: var(--font-size-lg);         /* 18px */
  font-weight: var(--font-weight-semibold);
  line-height: 1.5;
  color: var(--text-heading-tertiary);
}
```

## Heading Spacing

### Margins Between Elements
```
H1 → Paragraph: 1.5rem margin-bottom
H2 → Content: 1rem margin-bottom
H3 → Content: 0.75rem margin-bottom
```

### Vertical Rhythm
```css
/* Maintain consistent vertical spacing */
h2 { margin-top: 2rem; }
h3 { margin-top: 1.5rem; }
h4 { margin-top: 1rem; }
```

## Semantic Usage

### H1
- One per page (main title)
- Describes page purpose
- Example: "Diagnose Incident"

### H2
- Major sections
- Top-level organization
- Example: "Root Cause Analysis"

### H3
- Subsections within H2
- Detailed topics
- Example: "Evidence Collected"

### H4+
- Minor sections
- Rarely needed
- For complex documents

## Accessibility

### Screen Reader Considerations
```html
<!-- Good: Logical heading hierarchy -->
<h1>Page Title</h1>
<p>Intro text</p>
<h2>Section</h2>
<p>Section content</p>
<h3>Subsection</h3>
<p>Subsection content</p>

<!-- Bad: Skipped levels -->
<h1>Title</h1>
<h3>Section</h3> <!-- ❌ Skip from H1 to H3 -->
```

## CSS Custom Heading Classes
```css
.heading-1 { /* H1 style */ }
.heading-2 { /* H2 style */ }
.heading-3 { /* H3 style */ }
```

## Testing Checklist
- [ ] Heading hierarchy is logical (H1 → H2 → H3)
- [ ] No skipped heading levels
- [ ] Screen reader announces all headings
- [ ] Heading text is descriptive
- [ ] Contrast ratio ≥ 4.5:1
- [ ] Font sizes visually distinct

---
**Status**: ✓ Complete | **Phase**: B2 | **Date**: 2026-03-10
