# B3-10: Width & Height Utilities

## Overview
Standard width and height scales for consistent sizing.

## Width Scale
```css
--w-auto: auto;
--w-full: 100%;
--w-min: min-content;
--w-max: max-content;
--w-fit: fit-content;

--w-0: 0;
--w-1: 0.25rem;     /* 4px */
--w-2: 0.5rem;      /* 8px */
--w-4: 1rem;        /* 16px */
--w-6: 1.5rem;      /* 24px */
--w-8: 2rem;        /* 32px */
--w-12: 3rem;       /* 48px */
--w-16: 4rem;       /* 64px */
--w-24: 6rem;       /* 96px */
--w-32: 8rem;       /* 128px */
--w-48: 12rem;      /* 192px */
--w-64: 16rem;      /* 256px */
--w-80: 20rem;      /* 320px */
--w-screen: 100vw;
```

## Height Scale
```css
--h-auto: auto;
--h-full: 100%;
--h-screen: 100vh;
--h-min: min-content;
--h-max: max-content;
--h-fit: fit-content;

--h-0: 0;
--h-1: 0.25rem;     /* 4px */
--h-2: 0.5rem;      /* 8px */
--h-4: 1rem;        /* 16px */
--h-6: 1.5rem;      /* 24px */
--h-8: 2rem;        /* 32px */
--h-12: 3rem;       /* 48px */
--h-16: 4rem;       /* 64px */
--h-24: 6rem;       /* 96px */
--h-32: 8rem;       /* 128px */
--h-48: 12rem;      /* 192px */
--h-64: 16rem;      /* 256px */
```

## Min/Max Constraints
```css
--min-w-0: 0;
--min-w-full: 100%;
--min-h-0: 0;
--min-h-full: 100%;

--max-w-none: none;
--max-w-full: 100%;
--max-w-sm: 24rem;      /* 384px */
--max-w-md: 28rem;      /* 448px */
--max-w-lg: 32rem;      /* 512px */
--max-w-2xl: 42rem;     /* 672px */
--max-w-prose: 65ch;
--max-h-full: 100%;
--max-h-screen: 100vh;
```

## Common Usage

### Full Width Container
```css
.container {
  width: var(--w-full);
  max-width: var(--max-w-lg);
  margin: 0 auto;
}
```

### Fixed Size Box
```css
.box {
  width: var(--w-32);    /* 128px */
  height: var(--h-32);   /* 128px */
}
```

### Flexible Sizing
```css
.item {
  min-width: var(--min-w-0);
  max-width: var(--max-w-full);
  height: auto;
}
```

---
**Status**: ✓ Complete | **Phase**: B3 | **Date**: 2026-03-10
