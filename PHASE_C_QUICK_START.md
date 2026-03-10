# Phase C: Quick Start Guide

## What Was Built

A **production-ready React marketing website** for Claude Debug Copilot with:
- 11 React components
- Complete design token system
- 6 responsive CSS files
- 60 passing unit/integration tests
- WCAG 2.1 AA accessibility
- Dark mode support
- Mobile-first responsive design

## File Structure

```
src/www/
├── WebsiteApp.jsx                 # Main app entry point
├── design-tokens.js               # Design system (colors, typography, spacing)
├── components/
│   ├── Layout.jsx                 # Wrapper with CSS variable injection
│   ├── Header.jsx                 # Sticky navigation
│   ├── Hero.jsx                   # Main hero section
│   ├── HowItWorks.jsx             # 4-step process
│   ├── Features.jsx               # 6-feature grid
│   ├── Footer.jsx                 # Footer with links
│   └── [others]                   # Additional components
├── contexts/
│   ├── ThemeContext.jsx           # Light/dark theme
│   └── UIStateContext.jsx         # Mobile menu state
└── styles/
    ├── layout.css                 # Base styles + utilities
    ├── header.css                 # Navigation styling
    ├── hero.css                   # Hero section
    ├── how-it-works.css           # How It Works
    ├── features.css               # Features grid
    └── footer.css                 # Footer
```

## Key Components

### WebsiteApp (Main Entry Point)
```jsx
<ThemeProvider>
  <UIStateProvider>
    <Layout>
      <Header />
      <Hero />
      <HowItWorks />
      <Features />
      <Footer />
    </Layout>
  </UIStateProvider>
</ThemeProvider>
```

### Hero Section
- **Headline**: "Diagnose Incidents in Seconds. Not Hours."
- **CTA Button**: "DIAGNOSE NOW" → navigates to /diagnose
- **Secondary CTA**: "See how it works ↓" → scrolls to how-it-works

### How It Works
- 4 steps: Paste → Analyze → Diagnose → Execute
- Performance highlights below
- Responsive grid layout

### Features
- 6 key benefits with icons
- Card-based grid layout
- Hover effects with animations

## Design Tokens

All design values are in `design-tokens.js`:

```javascript
// Colors
designTokens.colors.primary[500]      // #4F46E5
designTokens.colors.neutral[900]      // #111827

// Typography
designTokens.typography.h1            // 3.5rem, 700 weight
designTokens.typography.body.base     // 1rem, 400 weight

// Spacing
designTokens.spacing.md               // 16px (base unit)
designTokens.spacing.lg               // 24px (1.5x)

// Breakpoints
designTokens.breakpoints.desktop      // 1200px
```

## CSS Architecture

### Design Token Injection
All CSS variables are injected via the Layout component:

```css
:root {
  --color-primary-500: #4F46E5;
  --spacing-md: 16px;
  --transition-base: 0.3s ease-in-out;
}
```

### Dark Theme
```css
[data-theme='dark'] {
  --color-primary-500: #8b5cf6;
  --color-neutral-0: #1a1a1a;
}
```

### Responsive Design
Mobile-first approach with max-width breakpoints:

```css
/* Base: Mobile styles */
.hero { font-size: 1.75rem; }

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .hero { font-size: 2.5rem; }
}

/* Desktop: 1200px+ */
@media (min-width: 1200px) {
  .hero { font-size: 3.5rem; }
}
```

## Running the Website

### Development
```bash
npm start
# Opens http://localhost:3000
```

### Tests
```bash
npm test -- tests/website-components.test.js
# 60/60 tests passing ✅
```

### Build for Production
```bash
npm run build
# Optimized bundle in dist/
```

## Key Features

### ✅ Accessibility (WCAG 2.1 AA)
- Color contrast ≥4.5:1
- Keyboard navigation (Tab, Enter, Escape)
- ARIA labels and semantic HTML
- Screen reader friendly
- Respects `prefers-reduced-motion`

### ✅ Responsive Design
- Mobile: <768px (single column)
- Tablet: 768px-1199px (2 columns)
- Desktop: ≥1200px (3-4 columns)
- Ultra-wide: ≥1400px (with max-width)

### ✅ Dark Mode
- Automatic detection via system preference
- Manual toggle in header
- Persists to localStorage
- Complete color override system

### ✅ Animations
- Entrance animations on scroll
- Staggered delays for visual hierarchy
- Respects user motion preferences
- 60fps target (GPU accelerated)

### ✅ Performance
- <50KB CSS (minified)
- <10KB design tokens
- 60fps animations
- Target: <2 second load time

## Testing

### Website Component Tests
```bash
npm test -- tests/website-components.test.js
```

**60 tests covering**:
- Design tokens (4 tests)
- Theme/UI contexts (5 tests)
- All components (28 tests)
- Integration workflows (10 tests)
- CSS architecture (4 tests)
- Performance (4 tests)

## Common Tasks

### Add a New Component
1. Create `src/www/components/MyComponent.jsx`
2. Create `src/www/styles/my-component.css`
3. Import in WebsiteApp.jsx
4. Add tests to `tests/website-components.test.js`

### Modify Colors
Edit `src/www/design-tokens.js`:
```javascript
colors: {
  primary: {
    500: '#NEW_HEX_COLOR'  // Update here
  }
}
```

### Update Typography
Edit `src/www/design-tokens.js`:
```javascript
typography: {
  h1: {
    fontSize: '3.5rem',    // Update size
    fontWeight: 700        // Update weight
  }
}
```

### Add Responsive Breakpoint
Edit CSS media queries:
```css
@media (min-width: 1600px) {
  /* Ultra-wide desktop */
}
```

## Dark Mode Implementation

### Automatic
System preference is detected on load via `prefers-color-scheme`

### Manual Toggle
Click the theme toggle button (☀️/🌙) in header

### Persistence
Theme preference saved to localStorage as `theme: 'light' | 'dark'`

### CSS Variable Override
```css
[data-theme='dark'] {
  --color-primary-500: #8b5cf6;  /* Purple for dark */
}
```

## Performance Optimization

### CSS
- All CSS files are optimized for gzip compression
- No unused styles (component-scoped)
- CSS variables enable theme switching without re-rendering

### JavaScript
- Design tokens are imported as needed
- Context providers only re-render affected subtrees
- Lazy loading ready (future enhancement)

### Animations
- Use CSS transforms (GPU accelerated)
- Avoid layout-triggering changes (width, height)
- Respect `prefers-reduced-motion` for users who prefer it

## Troubleshooting

### Colors Not Applying
Check:
1. Is `Layout` component wrapping the app?
2. Are CSS variables defined in `design-tokens.js`?
3. Is `data-theme` attribute set on documentElement?

### Mobile Menu Not Working
Check:
1. Is `UIStateProvider` wrapping the app?
2. Is `Header` properly using `useUIState()` hook?
3. Is CSS for `.nav-mobile` present?

### Animations Not Playing
Check:
1. Is `prefers-reduced-motion: no-preference` detected?
2. Are `@keyframes` defined in CSS?
3. Is `animation` property applied to element?

### Dark Mode Not Persisting
Check:
1. Is localStorage available in browser?
2. Is `ThemeProvider` handling localStorage.setItem()?
3. Is `data-theme` attribute updating on change?

## Next Steps (Phase D)

Phase D will add:
- Advanced motion and interaction libraries
- Scroll-triggered animations
- Gesture-based interactions
- Parallax effects
- Micro-interactions

See `PHASE_D_COMPLETION_SUMMARY.md` for details.

## Files Reference

| File | Purpose | Tests |
|------|---------|-------|
| `design-tokens.js` | Design system | 4 |
| `ThemeContext.jsx` | Light/dark theme | 3 |
| `UIStateContext.jsx` | Mobile menu state | 2 |
| `Layout.jsx` | CSS injection | 2 |
| `Header.jsx` | Navigation | 5 |
| `Hero.jsx` | Hero section | 8 |
| `HowItWorks.jsx` | 4-step flow | 6 |
| `Features.jsx` | Feature grid | 5 |
| `Footer.jsx` | Footer | 7 |
| **Integration** | - | 10 |
| **CSS Architecture** | - | 4 |
| **Performance** | - | 4 |

---

**Phase C Status**: ✅ COMPLETE
**Tests**: 60/60 passing
**Ready for**: Phase D (Motion & Interactions)
