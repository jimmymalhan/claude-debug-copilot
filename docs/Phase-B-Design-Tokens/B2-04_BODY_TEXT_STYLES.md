# B2-04: Body Text & Paragraph Styles

## Overview
Typography for body text, paragraphs, and general reading content.

## Paragraph Styles

### Default Paragraph
```css
p {
  font-size: var(--font-size-base);          /* 16px */
  font-weight: var(--font-weight-normal);    /* 400 */
  line-height: var(--line-height-normal);    /* 1.5 */
  color: var(--text-body);
  margin-bottom: 1rem;
  max-width: 65ch;
}
```

### Large Paragraph (Lead Text)
```css
.lead {
  font-size: var(--font-size-lg);            /* 18px */
  font-weight: var(--font-weight-normal);
  line-height: 1.5;
  color: var(--text-body-secondary);
  margin-bottom: 1.5rem;
}
```

### Small Paragraph
```css
.small {
  font-size: var(--font-size-sm);            /* 14px */
  font-weight: var(--font-weight-normal);
  line-height: 1.6;
  color: var(--text-body-tertiary);
}
```

## Text Emphasis

### Strong/Bold
```css
strong, b {
  font-weight: var(--font-weight-semibold);  /* 600 */
  color: var(--text-body);
}
```

### Emphasis/Italic
```css
em, i {
  font-style: italic;
  color: var(--text-body-secondary);
}
```

### Mark/Highlight
```css
mark {
  background-color: rgba(245, 158, 11, 0.2);
  color: var(--text-warning);
  padding: 0.2em 0.4em;
}
```

### Code Inline
```css
code, kbd {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background-color: var(--bg-subtle);
  color: var(--text-code);
  padding: 0.2em 0.4em;
  border-radius: 3px;
}
```

## List Styles

### Unordered Lists
```css
ul {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

ul li {
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

ul li::marker {
  color: var(--color-primary-500);
}
```

### Ordered Lists
```css
ol {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
  list-style-type: decimal;
}

ol li {
  line-height: 1.6;
  margin-bottom: 0.5rem;
}
```

### Definition Lists
```css
dt {
  font-weight: var(--font-weight-semibold);
  margin-top: 0.5rem;
}

dd {
  margin-left: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-body-secondary);
}
```

## Blockquotes
```css
blockquote {
  font-size: var(--font-size-lg);
  font-style: italic;
  line-height: 1.6;
  color: var(--text-body-secondary);
  margin: 1.5rem 0;
  padding-left: 1.5rem;
  border-left: 4px solid var(--color-primary-500);
}

blockquote cite {
  display: block;
  margin-top: 0.5rem;
  font-style: normal;
  font-size: var(--font-size-sm);
  color: var(--text-body-tertiary);
}
```

## Links Within Text
```css
a {
  color: var(--text-link);
  text-decoration: underline;
  transition: color 200ms ease;
}

a:hover {
  color: var(--text-link-hover);
  text-decoration: underline;
}

a:visited {
  color: var(--text-link-visited);
}

a:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

## Text Utilities
```css
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.uppercase { text-transform: uppercase; }
.lowercase { text-transform: lowercase; }
.capitalize { text-transform: capitalize; }
```

---
**Status**: ✓ Complete | **Phase**: B2 | **Date**: 2026-03-10
