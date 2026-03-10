# B2-01: Font Families & Typefaces

## Overview
Complete font family strategy with system fonts, fallbacks, and performance.

## Font Stack Strategy

### Sans-serif (Primary)
```css
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
```

**Order of preference:**
1. `-apple-system` - macOS/iOS system font
2. `BlinkMacSystemFont` - macOS system font
3. `Segoe UI` - Windows system font
4. `Roboto` - Android system font
5. `Helvetica`, `Arial` - Universal fallbacks
6. `sans-serif` - Generic fallback

### Serif (Secondary)
```css
--font-serif: 'Georgia', 'Times New Roman', 'Times', serif;
```

**Order of preference:**
1. `Georgia` - Web-safe serif
2. `Times New Roman`, `Times` - Fallbacks
3. `serif` - Generic fallback

### Monospace (Code)
```css
--font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Roboto Mono', monospace;
```

**Order of preference:**
1. `SF Mono` - macOS monospace
2. `Monaco` - macOS fallback
3. `Inconsolata` - Web-safe monospace
4. `Fira Code` - Open source
5. `Roboto Mono` - Android
6. `monospace` - Generic fallback

## Web Fonts

### Google Fonts Integration
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Variables
```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### Performance
- Use `display=swap` for font fallback
- Preload critical fonts only
- Self-host fonts if possible
- Limit to 2-3 font files

## Font Properties

### Base Font Sizes
```css
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 18px;
--font-size-xl: 20px;
--font-size-2xl: 24px;
--font-size-3xl: 30px;
--font-size-4xl: 36px;
```

### Font Weights
```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
```

### Line Heights
```css
--line-height-tight: 1.2;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
--line-height-loose: 2;
```

### Letter Spacing
```css
--letter-spacing-tight: -0.02em;
--letter-spacing-normal: 0em;
--letter-spacing-wide: 0.05em;
--letter-spacing-wider: 0.1em;
```

## CSS Implementation
```css
:root {
  /* Font Families */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-serif: 'Georgia', 'Times New Roman', serif;
  --font-mono: 'Courier New', monospace;

  /* Sizes */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;

  /* Weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Line Heights */
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* Letter Spacing */
  --letter-spacing-tight: -0.02em;
  --letter-spacing-normal: 0em;
  --letter-spacing-wide: 0.05em;
}

/* Apply to body */
body {
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}
```

## Browser Support
- ✓ All modern browsers
- ✓ System fonts: 100% compatibility
- ✓ Web fonts: Requires @font-face or Google Fonts
- ✓ Monospace fonts: 100% compatibility

## Performance Impact
- System fonts: No additional HTTP requests
- Web fonts: 1 HTTP request + font download
- Load time: ~200-500ms for web fonts
- Recommendation: Use system fonts for fastest load

---
**Status**: ✓ Complete | **Phase**: B2 | **Date**: 2026-03-10
