# UI Quality Assurance Test Suite (15 Tests)

## Pre-Test Setup
```bash
npm start
open http://localhost:3000
```

---

## Test 1: Header & Logo Entrance Animation ✅
**Purpose**: Verify header/nav elements slide in smoothly

**Steps**:
1. Load http://localhost:3000
2. Observe header appears immediately
3. Logo appears with zoom-fade (0.6s)
4. Nav links appear staggered (0.08s, 0.1s, 0.12s delays)
5. Documentation button appears (0.14s)

**Expected**:
- Smooth entrance without jank
- No flashing or invisible elements
- Proper stagger sequence (left to right)

**Pass Criteria**: ✅ All elements visible, smooth motion, no layout shift

---

## Test 2: Hero Title Zoom & Gradient ✅
**Purpose**: Main heading zooms in with gradient text

**Steps**:
1. Scroll to top of page
2. Watch "Diagnose Incidents Instantly" text
3. Should zoom from 88% scale → 100% over 0.8s
4. Should transition from opacity 0 → 1
5. Gradient should be visible (dark → blue)

**Expected**:
- Scale from 0.88 to 1.0
- Smooth easing (bouncy feel)
- Gradient text readable
- Positioned at center

**Pass Criteria**: ✅ Smooth zoom, gradient visible, centered, readable

---

## Test 3: Tagline Blur-In Effect ✅
**Purpose**: Subtitle appears with blur fade animation

**Steps**:
1. Below hero title
2. Tagline should start blurred (filter: blur(10px))
3. Fade in over 0.8s
4. Text should be sharp by end of animation
5. Color should transition from faded gray

**Expected**:
- Initial blur is visible
- Smooth blur-to-sharp transition
- Text readable immediately after animation
- Color 0→1 fade

**Pass Criteria**: ✅ Blur fade smooth, readable, no layout shift

---

## Test 4: Button Entrance & Glow ✅
**Purpose**: CTA buttons slide up and glow-ready

**Steps**:
1. Two buttons below tagline: "Start Diagnosis" + "Learn More"
2. Buttons slide up from bottom with 0.7s duration
3. On load, buttons have no visible glow
4. Hover over "Start Diagnosis" button
5. Observe glow (0 → 10px box-shadow)
6. Shadow color: rgba(0, 113, 227, 0.3)
7. Button background darkens slightly

**Expected**:
- Smooth slide-up entrance
- Glow appears on hover instantly
- Glow pulses (pulseGlow animation)
- Button lifts on hover (-4px)
- Shadow follows cursor

**Pass Criteria**: ✅ Slide-up smooth, hover glow appears, lift visible

---

## Test 5: Product Icon Floating Animation ✅
**Purpose**: Product icons bob up/down continuously

**Steps**:
1. Scroll to "Powerful Features" section
2. Observe 6 product cards (Router, Accuracy, Skeptic, etc.)
3. Watch icon (emoji) in each card
4. Icons should float: translateY(0) → translateY(-20px) → translateY(0)
5. Duration: 3-6 seconds per cycle
6. Should be continuous (infinite)

**Expected**:
- Smooth bobbing motion
- No jank or stuttering
- Natural wave-like effect
- Icon stays within card

**Pass Criteria**: ✅ Continuous float smooth, no jank, natural rhythm

---

## Test 6: Product Card Hover Zoom & Rotate ✅
**Purpose**: Cards zoom up on hover with rotating icon

**Steps**:
1. Hover over any product card
2. Card should lift (translateY(-12px))
3. Shadow should deepen (0 20px 60px)
4. Icon should scale + rotate (scale(1.15) rotate(10deg))
5. Background gradient should shift
6. Overlay gradient should appear (opacity 0 → 1)

**Expected**:
- Smooth transform over 0.3s
- Icon rotation visible
- Shadow extends far below card
- All hover effects synchronized
- Release hover: smooth return to normal

**Pass Criteria**: ✅ Zoom smooth, icon rotates, shadow visible, sync'd

---

## Test 7: Product Card Stagger Entrance ✅
**Purpose**: Products appear with cascading delays

**Steps**:
1. Scroll to products section
2. Observe cards appear staggered (not all at once)
3. Card 1: 0.1s delay
4. Card 2: 0.15s delay
5. Card 3: 0.2s delay
6. Card 4: 0.25s delay
7. Card 5: 0.3s delay
8. Card 6: 0.35s delay
9. Total: 0.35 seconds for complete grid entrance

**Expected**:
- Waterfall entrance effect
- Each card 50ms offset
- Smooth fadeIn + slideUp for each
- No overlap in timing

**Pass Criteria**: ✅ Stagger visible, 50ms offsets, smooth waterfall

---

## Test 8: Product Overlay Gradient ✅
**Purpose**: Gradient overlay appears on product hover

**Steps**:
1. Hover over product card
2. Watch for gradient overlay (::before pseudo-element)
3. Overlay should gradient left-to-right
4. Should transition from opacity 0 → 1
5. Colors: transparent → rgba(0, 113, 227, 0.05)

**Expected**:
- Subtle gradient visible on hover
- Doesn't obscure card content
- Smooth opacity transition
- Removed on mouse leave

**Pass Criteria**: ✅ Overlay appears, subtle, synchronized with hover

---

## Test 9: Parallax on Scroll ✅
**Purpose**: Background blobs move slower than scroll

**Steps**:
1. Open http://localhost:3000
2. Scroll down slowly (observe blobs)
3. Scroll up slowly (observe blobs move opposite)
4. Blobs should lag behind scroll by ~50%
5. Effect visible in upper-left and lower-right blobs

**Expected**:
- Blobs appear to float
- Slower movement than page scroll
- Natural depth effect
- No jank when scrolling

**Pass Criteria**: ✅ Parallax visible, smooth, depth effect works

---

## Test 10: Scroll-Triggered Stats Reveal ✅
**Purpose**: Stats cards appear when scrolled into view

**Steps**:
1. Load page at top
2. Stats section should NOT be animated yet
3. Scroll down to "By The Numbers" section
4. Observe 4 stat cards appear with stagger:
   - "16-30s": 0.1s delay
   - "94%": 0.2s delay
   - "949": 0.3s delay
   - "89%+": 0.4s delay
5. Animation: slideUp + fadeIn over 0.8s
6. Easing: cubic-bezier(0.34, 1.56, 0.64, 1) - bouncy

**Expected**:
- Cards invisible until scrolled into view
- Smooth appearance with stagger
- Bouncy easing (squash & stretch feel)
- No re-animation on scroll

**Pass Criteria**: ✅ Scroll trigger works, stagger visible, bouncy feel

---

## Test 11: Diagnosis Form Focus Glow ✅
**Purpose**: Form input glows on focus

**Steps**:
1. Scroll to "Describe Your Incident" section
2. Click on textarea
3. On focus:
   - Border color: #e5e5e5 → #0071e3
   - Background: #f5f5f7 → white
   - Box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.15)
   - Transform: translateY(-2px) slight lift
4. Type some text (should work)
5. Click outside
6. All effects should reverse smoothly

**Expected**:
- Blue glow appears instantly
- Glow is visible but not blinding
- Input lifts slightly
- Smooth transition in/out
- Character counter updates

**Pass Criteria**: ✅ Glow appears, lift visible, counter works

---

## Test 12: Button Hover Glow & Shine ✅
**Purpose**: Submit button has glow + shine effect

**Steps**:
1. Hover over "Diagnose" button (in form)
2. Observe box-shadow glow (pulseGlow animation)
3. Glow should pulse: 0 → 10px → 0 (2s cycle)
4. Watch for shine effect (left-to-right sweep)
5. Button background darkens on hover
6. Button gradient visible on hover

**Expected**:
- Glow pulses continuously while hovering
- Shine sweeps across once per hover
- Background gradient smooth
- All effects sync'd
- Click should submit (no errors)

**Pass Criteria**: ✅ Glow pulses, shine visible, click works, no errors

---

## Test 13: Mouse Tracking 3D Rotation ✅
**Purpose**: Diagnosis card rotates with mouse position

**Steps**:
1. Move cursor slowly around diagnosis card
2. Card should rotate based on cursor position:
   - Move cursor up → card rotates up (rotateX negative)
   - Move cursor down → card rotates down (rotateX positive)
   - Move cursor left → card rotates left (rotateY negative)
   - Move cursor right → card rotates right (rotateY positive)
3. Rotation range: -5deg to +5deg
4. Move cursor away from card
5. Card should return to flat (0 rotation)

**Expected**:
- Smooth 3D rotation following cursor
- Subtle effect (not extreme)
- Smooth return to neutral
- No flashing or jank

**Pass Criteria**: ✅ 3D rotation follows cursor, smooth, returns to neutral

---

## Test 14: Diagnosis Submission & Results Cascade ✅
**Purpose**: Submit incident, results cascade in

**Steps**:
1. Type incident (10+ characters): "Database query takes 45 seconds"
2. Click "Diagnose"
3. Loading spinner appears with blur animation
4. After 16-30 seconds, results should cascade in:
   - Confidence badge: 0.1s delay
   - Root Cause: 0.2s delay
   - Evidence: 0.3s delay
   - Fix Plan: 0.4s delay
   - Tests: 0.5s delay
   - Rollback: 0.6s delay
5. Each result item slides up + fades in
6. Buttons should work: Copy, Export, New Diagnosis

**Expected**:
- Loading spinner smooth
- Results appear without jank
- Cascade timing visible
- All 6 results have 0.1s spacing
- Export/Copy buttons functional
- No JS errors

**Pass Criteria**: ✅ Loading smooth, cascade visible, 0.1s spacing, buttons work

---

## Test 15: No JavaScript Errors ✅
**Purpose**: Console should be error-free

**Steps**:
1. Open DevTools (F12)
2. Go to Console tab
3. Run through all 14 tests above
4. Trigger every interactive element
5. Perform full diagnosis workflow
6. Scroll entire page
7. Check console for errors

**Expected**:
- Zero errors in console
- Zero warnings (ignore browser warnings)
- All logs are intentional (if any)
- Page remains responsive

**Pass Criteria**: ✅ Console clean, page responsive, no crashes

---

## Test Results Template

```
Date: ___________
Tester: _________

Test 1: Header Entrance - ✅ PASS / ❌ FAIL / ⏭️ SKIP
Test 2: Title Zoom - ✅ PASS / ❌ FAIL / ⏭️ SKIP
Test 3: Tagline Blur - ✅ PASS / ❌ FAIL / ⏭️ SKIP
Test 4: Button Glow - ✅ PASS / ❌ FAIL / ⏭️ SKIP
Test 5: Product Float - ✅ PASS / ❌ FAIL / ⏭️ SKIP
Test 6: Product Hover - ✅ PASS / ❌ FAIL / ⏭️ SKIP
Test 7: Product Stagger - ✅ PASS / ❌ FAIL / ⏭️ SKIP
Test 8: Overlay Gradient - ✅ PASS / ❌ FAIL / ⏭️ SKIP
Test 9: Parallax Scroll - ✅ PASS / ❌ FAIL / ⏭️ SKIP
Test 10: Stats Reveal - ✅ PASS / ❌ FAIL / ⏭️ SKIP
Test 11: Form Glow - ✅ PASS / ❌ FAIL / ⏭️ SKIP
Test 12: Button Shine - ✅ PASS / ❌ FAIL / ⏭️ SKIP
Test 13: Mouse 3D - ✅ PASS / ❌ FAIL / ⏭️ SKIP
Test 14: Results Cascade - ✅ PASS / ❌ FAIL / ⏭️ SKIP
Test 15: No Errors - ✅ PASS / ❌ FAIL / ⏭️ SKIP

Summary: __ / 15 PASSED

Notes:
_________________________________________
_________________________________________
```

---

## Quick Test (2 minutes)
If you only have time for a quick check:

1. Load http://localhost:3000
2. Observe header/hero entrance (should be smooth)
3. Hover product card (should zoom + rotate)
4. Scroll down (should see stagger)
5. Submit diagnosis (should cascade)

✅ All smooth? Great! UI is working.

---

## Automated Testing (Optional - Future)
```javascript
// Tests to add to Jest/E2E:
test('Product cards have floating animation', () => { ... });
test('Results cascade with correct delays', () => { ... });
test('No JS errors during full workflow', () => { ... });
test('Form glow appears on focus', () => { ... });
test('Mouse tracking rotates diagnosis card', () => { ... });
```

---

## Performance Checklist

After QA passes:

- [ ] DevTools: Timeline shows 60 FPS during animations
- [ ] DevTools: No layout thrashing
- [ ] Mobile: Test on iOS Safari (iPad)
- [ ] Mobile: Test on Android Chrome
- [ ] Performance: Page speed <3s (Lighthouse)
- [ ] Accessibility: Screen reader reads all elements
- [ ] Accessibility: Keyboard navigation works (Tab, Enter)

---

## Sign-Off

**QA Passed**: _____ Date: _____ Tester: _____________

All 15 tests passed. UI is production-ready for luxury release.
