# B3-11: Transition & Transform Utilities

## Overview
CSS transition and transform utilities for animations.

## Transition Properties

### Transition All
```css
.transition-all {
  transition-property: all;
  transition-timing-function: var(--easing-in-out);
  transition-duration: var(--duration-smooth);
}
```

### Transition Colors
```css
.transition-colors {
  transition-property: background-color, border-color, color;
  transition-duration: var(--duration-smooth);
}
```

### Transition Transform
```css
.transition-transform {
  transition-property: transform;
  transition-duration: var(--duration-smooth);
}
```

### Transition Opacity
```css
.transition-opacity {
  transition-property: opacity;
  transition-duration: var(--duration-smooth);
}
```

## Transform Utilities

### Translate
```css
.translate-x-1 { transform: translateX(4px); }
.translate-y-1 { transform: translateY(4px); }
.-translate-y-2 { transform: translateY(-8px); }
```

### Scale
```css
.scale-95 { transform: scale(0.95); }
.scale-100 { transform: scale(1); }
.scale-105 { transform: scale(1.05); }
```

### Rotate
```css
.rotate-0 { transform: rotate(0deg); }
.rotate-45 { transform: rotate(45deg); }
.rotate-90 { transform: rotate(90deg); }
```

### Skew
```css
.skew-x-2 { transform: skewX(2deg); }
.skew-y-2 { transform: skewY(2deg); }
```

## Combined Transforms
```css
.transform-gpu {
  transform: translateZ(0);  /* Use GPU acceleration */
}

.scale-and-fade {
  transform: scale(0.95);
  opacity: 0.5;
}
```

---
**Status**: ✓ Complete | **Phase**: B3 | **Date**: 2026-03-10
