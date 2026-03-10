# B3-09: Aspect Ratios

## Overview
Standard aspect ratios for images, videos, and containers.

## Common Aspect Ratios

### Square (1:1)
```css
--aspect-square: 1 / 1;
```
Usage: Avatars, icon backgrounds, thumbnails

### 4:3 (Standard)
```css
--aspect-4-3: 4 / 3;
```
Usage: Old monitors, some displays

### 16:9 (Widescreen)
```css
--aspect-16-9: 16 / 9;
```
Usage: Videos, modern monitors

### 21:9 (Ultrawide)
```css
--aspect-21-9: 21 / 9;
```
Usage: Ultrawide monitors, cinematic

### 3:2 (Classic)
```css
--aspect-3-2: 3 / 2;
```
Usage: Film, photography

### 9:16 (Vertical)
```css
--aspect-9-16: 9 / 16;
```
Usage: Stories, portrait videos, mobile

## CSS Implementation

### Aspect Ratio Property
```css
.video-container {
  aspect-ratio: 16 / 9;
  width: 100%;
  /* Height automatically calculated */
}
```

### Padding Hack (Legacy)
```css
.video-container {
  position: relative;
  padding-bottom: 56.25%;  /* 16:9 = 9/16 */
}

.video-container iframe {
  position: absolute;
  width: 100%;
  height: 100%;
}
```

## CSS Variables
```css
:root {
  /* Aspect Ratios */
  --aspect-square: 1 / 1;
  --aspect-4-3: 4 / 3;
  --aspect-16-9: 16 / 9;
  --aspect-21-9: 21 / 9;
  --aspect-3-2: 3 / 2;
  --aspect-9-16: 9 / 16;
}
```

## Image Containers

### Avatar (Square)
```css
.avatar {
  aspect-ratio: var(--aspect-square);
  width: 48px;
  border-radius: 50%;
}
```

### Thumbnail (4:3)
```css
.thumbnail {
  aspect-ratio: var(--aspect-4-3);
  width: 200px;
}
```

### Video Embed (16:9)
```css
.video-embed {
  aspect-ratio: var(--aspect-16-9);
  width: 100%;
}
```

## Responsive Aspect Ratios

### Different Ratios per Breakpoint
```css
/* Mobile: Square */
.image {
  aspect-ratio: var(--aspect-square);
}

/* Tablet and up: 16:9 */
@media (min-width: 768px) {
  .image {
    aspect-ratio: var(--aspect-16-9);
  }
}
```

## Browser Support
- ✓ aspect-ratio: Chrome 88+, Firefox 89+, Safari 15+
- ⚠️ Older browsers: Use padding-bottom hack

---
**Status**: ✓ Complete | **Phase**: B3 | **Date**: 2026-03-10
