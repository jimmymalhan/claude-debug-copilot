# A1-10: Hero Section Storyboard - Visual Wireframe With Copy

**Task**: Create hero section storyboard - Visual wireframe with copy
**Status**: ✅ COMPLETE
**Date**: 2026-03-09
**Owner**: Content Team (Team 1)
**Depends on**: A1-06, A1-09 ✅ Complete

---

## Desktop Hero Section Wireframe (1200px+)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌────────── NAVIGATION BAR ──────────┐        ┌─ SECONDARY MENU ─┐       │
│  │ Logo                               │        │ Docs | Sign In   │       │
│  └────────────────────────────────────┘        └──────────────────┘       │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                          HERO SECTION (Full Width)                         │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                                                                     │  │
│  │  [Background: Gradient or subtle animation]                        │  │
│  │                                                                     │  │
│  │                                                                     │  │
│  │                   Diagnose Incidents in Seconds.                   │  │
│  │                        Not Hours.                                  │  │
│  │                   [h1 - 3.5rem, bold, centered]                   │  │
│  │                                                                     │  │
│  │                 Paste your incident. Get evidence-backed            │  │
│  │               root cause with a fix plan in seconds.               │  │
│  │              [p - 1.125rem, secondary text, centered]              │  │
│  │                                                                     │  │
│  │                                                                     │  │
│  │                    ┌─────────────────────┐                         │  │
│  │                    │    DIAGNOSE NOW     │                         │  │
│  │                    │ [Button - 48px tall] │                        │  │
│  │                    └─────────────────────┘                         │  │
│  │                                                                     │  │
│  │                   See how it works ↓                               │  │
│  │              [Secondary CTA - subtle link]                         │  │
│  │                                                                     │  │
│  │                                                                     │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ [Next Section: How It Works]                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Dimensions and Spacing

**Hero Section Height**: 500-600px (varies by content)
**Max Content Width**: 1200px (with padding)
**Internal Padding**: 60-80px top/bottom

**Headline (h1)**
- Font size: 3.5rem (56px)
- Weight: 700 (bold)
- Line height: 1.2
- Color: Primary text (#1d1d1f or equivalent)
- Margin bottom: 20px

**Subheadline (p)**
- Font size: 1.125rem (18px)
- Weight: 400 (regular)
- Line height: 1.6
- Color: Secondary text (#666 or equivalent)
- Max width: 600px (centered)
- Margin bottom: 40px

**Primary CTA Button**
- Height: 48px
- Padding: 12px 32px
- Font size: 1rem (16px)
- Font weight: 600 (semibold)
- Border radius: 8px (modern look)
- Background: Action color (blue)
- Hover: Slightly darker blue + subtle shadow
- Focus: Visible outline (accessibility)

**Secondary CTA Link**
- Font size: 0.9rem (14px)
- Color: Secondary text
- Margin top: 20px
- Hover: Underline

---

## Tablet Hero Section (768px - 1199px)

```
┌────────────────────────────────────────────────────┐
│ HERO SECTION (Responsive)                          │
│                                                    │
│ Diagnose Incidents in Seconds.                    │
│ Not Hours.                                         │
│ [Headline - 2.5rem]                               │
│                                                    │
│ Paste your incident. Get evidence-backed           │
│ root cause with a fix plan in seconds.             │
│ [Subheadline - 1rem]                              │
│                                                    │
│ ┌──────────────────────────┐                      │
│ │    DIAGNOSE NOW          │                      │
│ │   [Full width button]     │                      │
│ └──────────────────────────┘                      │
│                                                    │
│ See how it works ↓                                 │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Tablet-Specific Adjustments**:
- Hero height: 400-500px
- Headline: 2.5rem (40px)
- Subheadline: 1rem (16px)
- CTA Button: Full width or 80% width
- Max content width: 90% of viewport

---

## Mobile Hero Section (<768px)

```
┌────────────────────────────┐
│ HERO SECTION (Mobile)      │
│                            │
│ Diagnose Incidents in      │
│ Seconds. Not Hours.        │
│ [h1 - 1.75rem]            │
│                            │
│ Paste your incident. Get   │
│ evidence-backed root       │
│ cause with a fix plan      │
│ in seconds.                │
│ [p - 0.95rem]             │
│                            │
│ ┌──────────────────────┐   │
│ │   DIAGNOSE NOW       │   │
│ │ [Full width 44px min]│   │
│ └──────────────────────┘   │
│                            │
│ See how it works ↓         │
│                            │
└────────────────────────────┘
```

**Mobile-Specific Adjustments**:
- Hero height: 350-400px
- Headline: 1.75rem (28px)
- Subheadline: 0.95rem (15px)
- CTA Button: Full width (100% with padding)
- Min button height: 44px (touch-friendly)
- Padding: 40px 20px
- Secondary CTA: Below button, hidden below fold option

---

## Background Visual Considerations

### Option A: Solid Color with Gradient
```
Background: Gradient from light gray (#f5f5f7) to white
Effect: Subtle, professional, focus on text
```

### Option B: Animated Pattern
```
Background: Subtle animated pattern or shapes
Effect: More dynamic, but not distracting
Risk: Performance on mobile
```

### Option C: Image or Video
```
Background: Header image or video (incident dashboard preview)
Effect: Visual appeal, shows product in action
Risk: Could be confusing, image load time
```

**Recommendation**: Option A (Gradient) or Option C (Product preview video)

---

## Accessibility Checklist

- [ ] Color contrast ≥4.5:1 (text vs background)
- [ ] Headline size ≥32px (readable at 200% zoom)
- [ ] Button size ≥44px (mobile touch target)
- [ ] Focus visible on button (outline or ring)
- [ ] Button text is clear (not just icon)
- [ ] Alt text for any background images
- [ ] Respects prefers-reduced-motion (no auto-animation)
- [ ] Keyboard navigable (Tab to button, Enter to click)

---

## Animation Specifications

### Optional Entrance Animations
**Do NOT auto-animate**. Only animate on scroll:

#### Headline Animation
```
Trigger: Page load or scroll into view
Animation: Fade in + slight scale (0.95 → 1)
Duration: 600ms
Easing: ease-out cubic-bezier
Delay: 0ms
Respect: prefers-reduced-motion (disable if present)
```

#### Subheadline Animation
```
Trigger: Page load or scroll into view
Animation: Fade in + slide up (10px)
Duration: 600ms
Easing: ease-out cubic-bezier
Delay: 100ms (after headline)
Respect: prefers-reduced-motion (disable if present)
```

#### Button Animation
```
Trigger: Page load or scroll into view
Animation: Fade in + scale (0.8 → 1)
Duration: 600ms
Easing: ease-out cubic-bezier
Delay: 200ms (after subheadline)
Respect: prefers-reduced-motion (disable if present)
```

#### Button Hover Animation (Desktop Only)
```
Trigger: Mouse hover
Animation: Scale (1 → 1.05) + shadow depth increase
Duration: 200ms
Easing: ease-in-out cubic-bezier
Respect: prefers-reduced-motion (disable if present)
```

---

## Storyboard Annotations

### Key Design Decisions

1. **Centered Layout**: All text and buttons centered for maximum focus
2. **Large Headline**: 3.5rem ensures readability and impact
3. **Clear Visual Hierarchy**: Headline > Subheadline > CTA
4. **Sufficient Whitespace**: Breathing room between elements
5. **High Contrast Button**: Action color stands out
6. **Mobile-First Responsive**: Works on all screen sizes
7. **Subtle Animations**: Only on scroll, respect user preferences

---

## Implementation Notes for Phase C

### For Frontend Team (Phase C)
- Headline goes in `<h1>` tag
- Subheadline goes in `<p class="hero-subheadline">`
- Button is `<button class="primary-cta">DIAGNOSE NOW</button>`
- Secondary link is `<a href="#how-it-works">See how it works ↓</a>`
- Background uses CSS gradient (no images, fast load)
- Entrance animations use CSS Keyframes + Intersection Observer

### HTML Structure
```html
<section class="hero">
  <div class="hero-content">
    <h1>Diagnose Incidents in Seconds. Not Hours.</h1>
    <p class="hero-subheadline">Paste your incident. Get evidence-backed root cause with a fix plan in seconds.</p>
    <button class="primary-cta">DIAGNOSE NOW</button>
    <a href="#how-it-works" class="secondary-cta">See how it works ↓</a>
  </div>
</section>
```

### CSS Requirements
```css
.hero {
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%);
}

.hero-content {
  text-align: center;
  max-width: 600px;
  padding: 60px 20px;
}

h1 {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 20px;
  color: #1d1d1f;
}

.hero-subheadline {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 40px;
}

.primary-cta {
  height: 48px;
  padding: 12px 32px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background-color: #0071e3;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.primary-cta:hover {
  background-color: #0051bc;
  box-shadow: 0 4px 12px rgba(0, 113, 227, 0.3);
}

.primary-cta:focus {
  outline: 2px solid #0071e3;
  outline-offset: 2px;
}

@media (max-width: 1199px) {
  h1 { font-size: 2.5rem; }
  .hero-subheadline { font-size: 1rem; }
}

@media (max-width: 767px) {
  h1 { font-size: 1.75rem; }
  .hero-subheadline { font-size: 0.95rem; }
  .primary-cta { width: 100%; }
}
```

---

## Sign-Off

✅ **A1-10 Complete**
- Desktop hero section wireframe (1200px+) ✅
- Tablet hero section wireframe (768px-1199px) ✅
- Mobile hero section wireframe (<768px) ✅
- Dimensions and spacing documented ✅
- Background visual options provided ✅
- Accessibility checklist included ✅
- Animation specifications defined ✅
- Implementation notes for Phase C provided ✅
- HTML/CSS structure documented ✅

**Key Deliverable**: Complete wireframe with copy, spacing, responsive breakpoints, and CSS structure ready for Phase C implementation.
