# B1-14: Theming Strategy & Implementation

## Overview
Complete theming system for light/dark mode with user preferences and storage.

## Theming Approach

### Automatic (System Preference)
```javascript
// Detect system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

### Manual (User Toggle)
```javascript
// User toggles theme
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
}
```

### Persistent (LocalStorage)
```javascript
// Load saved preference
function loadTheme() {
  const saved = localStorage.getItem('theme');
  const preferred = saved || getSystemPreference();
  applyTheme(preferred);
}
```

## CSS Implementation

### Root Variables (Light Theme)
```css
:root {
  --color-primary-900: #1E1B4B;
  --color-neutral-0: #FFFFFF;
  --button-primary-bg: var(--color-primary-500);
}
```

### Dark Theme with Media Query
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary-900: #E0E7FF;
    --color-neutral-0: #0F172A;
    --button-primary-bg: var(--color-dark-primary-200);
  }
}
```

### Dark Theme with Data Attribute
```css
[data-theme='dark'] {
  --color-primary-900: #E0E7FF;
  --color-neutral-0: #0F172A;
  --button-primary-bg: var(--color-dark-primary-200);
}
```

## JavaScript Implementation

### Theme Manager
```javascript
class ThemeManager {
  constructor() {
    this.theme = this.loadTheme();
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.mediaQuery.addEventListener('change', () => this.applySystemTheme());
  }

  loadTheme() {
    const saved = localStorage.getItem('theme');
    return saved || this.getSystemPreference();
  }

  getSystemPreference() {
    return this.mediaQuery.matches ? 'dark' : 'light';
  }

  applyTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    const next = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
  }
}
```

## HTML Implementation

### Theme Toggle Button
```html
<button id="theme-toggle" aria-label="Toggle theme">
  <span id="theme-icon">🌙</span>
  <span id="theme-label">Dark mode</span>
</button>

<script>
  const toggle = document.getElementById('theme-toggle');
  const manager = new ThemeManager();

  toggle.addEventListener('click', () => {
    manager.toggleTheme();
    updateIcon();
  });

  function updateIcon() {
    const isDark = manager.theme === 'dark';
    document.getElementById('theme-icon').textContent = isDark ? '☀️' : '🌙';
    document.getElementById('theme-label').textContent = isDark ? 'Light mode' : 'Dark mode';
  }

  updateIcon();
</script>
```

## Transition Animation

### Smooth Color Transition
```css
:root {
  --color-transition: 200ms ease-in-out;
}

* {
  transition: background-color var(--color-transition),
              color var(--color-transition),
              border-color var(--color-transition);
}
```

### Prevent Flash
```html
<script>
  // Before page renders, apply saved theme
  (function() {
    const theme = localStorage.getItem('theme') ||
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>
```

## Accessibility

### High Contrast Preference
```css
@media (prefers-contrast: more) {
  :root {
    --color-primary-900: #000000;
    --color-neutral-0: #FFFFFF;
  }
}
```

### Reduced Motion Preference
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Testing Checklist

- [ ] Light theme displays correctly
- [ ] Dark theme displays correctly
- [ ] Theme toggle works
- [ ] Theme persists on page reload
- [ ] System preference respected
- [ ] No flash on page load
- [ ] Transition is smooth
- [ ] Contrast ratios maintained in both themes
- [ ] All colors visible in both themes
- [ ] Focus rings visible in both themes

---
**Status**: ✓ Complete | **Phase**: B1 | **Date**: 2026-03-10
