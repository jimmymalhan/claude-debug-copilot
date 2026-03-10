# B3-12: Container Queries & Responsive Containers

## Overview
Component-level responsive design with container queries.

## Container Definition

### Container Size Query
```css
.card-container {
  container-type: size;
  container-name: card;
}
```

### Container Inline Query
```css
.grid-container {
  container-type: inline-size;
  container-name: grid;
}
```

## Container Query Breakpoints

### Small Container (< 320px)
```css
@container (max-width: 320px) {
  .card { padding: var(--space-2); }
}
```

### Medium Container (320px - 600px)
```css
@container (min-width: 320px) and (max-width: 600px) {
  .card { padding: var(--space-4); }
}
```

### Large Container (> 600px)
```css
@container (min-width: 600px) {
  .card { padding: var(--space-6); }
}
```

## Common Patterns

### Card Component
```css
.card-container {
  container-type: inline-size;
}

@container (max-width: 400px) {
  .card-header { flex-direction: column; }
}

@container (min-width: 400px) {
  .card-header { flex-direction: row; }
}
```

### Grid Layout
```css
.grid-container {
  container-type: size;
}

@container (max-width: 500px) {
  .grid { grid-template-columns: 1fr; }
}

@container (min-width: 500px) and (max-width: 900px) {
  .grid { grid-template-columns: 1fr 1fr; }
}

@container (min-width: 900px) {
  .grid { grid-template-columns: 1fr 1fr 1fr; }
}
```

## Browser Support
- Chrome 105+
- Firefox 110+
- Safari 16+
- Edge 105+

---
**Status**: ✓ Complete | **Phase**: B3 | **Date**: 2026-03-10
