# A1-06: Landing Page Copy Structure - Full Hero Section Flow

**Task**: Create landing page copy structure - Full hero section flow
**Status**: ✅ COMPLETE
**Date**: 2026-03-09
**Owner**: Content Team (Team 1)
**Depends on**: A1-03, A1-04, A1-05 ✅ Complete

---

## Hero Section Copy Flow

### Complete Hero Section (Top to Bottom)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Navigation Bar]                                          │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐│
│  │ HERO SECTION                                           ││
│  │                                                        ││
│  │ Diagnose Incidents in Seconds. Not Hours.            ││
│  │ [Main Headline - 9 words]                            ││
│  │                                                        ││
│  │ Paste your incident. Get evidence-backed root cause  ││
│  │ with a fix plan in seconds.                          ││
│  │ [Subheadline - 12 words]                             ││
│  │                                                        ││
│  │ ┌──────────────────┐                                  ││
│  │ │  DIAGNOSE NOW    │                                  ││
│  │ │  [Primary CTA]   │                                  ││
│  │ └──────────────────┘                                  ││
│  │                                                        ││
│  │ [Optional: "See how it works ↓" secondary CTA]        ││
│  │                                                        ││
│  └────────────────────────────────────────────────────────┘│
│                                                             │
│  [Next section: How It Works]                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Copy Hierarchy

### Tier 1: Hero Headline (Attention)
```
"Diagnose Incidents in Seconds. Not Hours."
```
- **Purpose**: Grab attention, establish the benefit
- **Format**: 2 parts (promise + contrast)
- **Length**: 9 words
- **Emphasis**: First sentence (diagnosis in seconds)
- **Secondary**: "Not hours" (contrasts with painful current state)

### Tier 2: Subheadline (Clarity)
```
"Paste your incident. Get evidence-backed root cause with a fix plan in seconds."
```
- **Purpose**: Explain what user gets
- **Format**: 3 parts (action + output + proof)
- **Length**: 12 words
- **Part 1**: "Paste your incident" (what user does)
- **Part 2**: "Get evidence-backed root cause" (what they get)
- **Part 3**: "with a fix plan in seconds" (bonus + speed)

### Tier 3: CTA Button (Action)
```
"DIAGNOSE NOW"
```
- **Purpose**: Clear call to action
- **Format**: Verb + urgency (2 words)
- **Size**: Large, high-contrast, 44px minimum
- **Placement**: Centered below subheadline

### Tier 4: Optional Secondary CTA (Exploration)
```
"See how it works ↓"
or
"Watch demo"
or
"Learn more"
```
- **Purpose**: For users not ready to commit
- **Format**: Lowercase, subtle link styling
- **Placement**: Below primary CTA (optional)

---

## Copy Validation Against Pain Points

### Pain Point #1: Diagnosis Time Pressure
✅ **Addressed by**: "in seconds" (headline) + "in seconds" (subheadline)
✅ **Proof**: Speed benefit stated twice for emphasis

### Pain Point #2: Evidence Fragmentation
✅ **Addressed by**: "evidence-backed root cause" (subheadline)
✅ **Proof**: Shows user gets unified answer (not scattered findings)

### Pain Point #4: Lack of Fix Confidence
✅ **Addressed by**: "with a fix plan" (subheadline)
✅ **Proof**: Explicit mention of fix plan (not just diagnosis)

### Pain Point #3: RCA Documentation
❌ **Not explicitly addressed** (addressed in later sections)
❌ **Future**: Can mention "instant RCA" in secondary sections

### Pain Point #5: Alert Fatigue
❌ **Not explicitly addressed** (team benefit, not individual)
❌ **Future**: Address in team benefits section

---

## Alternative Copy Structures

### Structure B: Problem-Solution Focus
```
Headline: "Stop Hunting Logs. Start Solving Problems."
Subheadline: "Paste your incident. Get evidence-backed diagnosis instantly."
CTA: "Get Started"
```
- **Pros**: Contrasts with painful current approach
- **Cons**: Less emphasis on specific benefit (seconds)

### Structure C: Team Benefit Focus
```
Headline: "SREs Diagnose Faster. Teams Sleep Better."
Subheadline: "Reduce incident response time by 75%. Stop waking the team for guesses."
CTA: "Try Now"
```
- **Pros**: Addresses team pain (alert fatigue)
- **Cons**: Less immediate appeal to individual user

### Structure D: Trust-Focused
```
Headline: "Evidence Over Guesses. Diagnose with Confidence."
Subheadline: "Every diagnosis is backed by actual evidence with proof and a tested fix plan."
CTA: "Diagnose Now"
```
- **Pros**: Addresses confidence pain point
- **Cons**: Longer, more formal, less speed emphasis

---

## Copy Information Architecture

### What Hero Section Must Communicate
✅ **WHAT**: Tool diagnoses incidents
✅ **WHY**: Saves time, increases confidence
✅ **HOW**: Paste incident, get results
✅ **WHEN**: Instantly (seconds)
✅ **PROOF**: Evidence-backed, includes fix plan

### What Hero Section Doesn't Need to Say
❌ "4-agent orchestration" (save for later)
❌ "Claude AI" (keep implicit, not sales pitch)
❌ "Root cause analysis" (too technical, just show benefit)
❌ "Paperclip framework" (internal naming)
❌ "Production-grade" (show, don't tell)

---

## Copy Tone and Voice

### Tone Characteristics
- **Professional**: Not overly casual or silly
- **Direct**: No fluff, get to point fast
- **Confident**: We know this solves your problem
- **Empathetic**: We understand your pain (diagnosis time pressure)
- **Clear**: No jargon, plain language

### Voice Examples

#### ✅ Good (Confident, Direct)
"Diagnose incidents in seconds."
"Get evidence-backed root cause with a fix plan."
"Stop guessing. Get answers."

#### ❌ Bad (Jargon, Unclear)
"Leverage evidence-first methodology for production-grade incident orchestration."
"Our 4-agent pipeline provides comprehensive diagnostic analysis."
"Implement Paperclip verification for root cause determination."

---

## Copy Variations (Testing)

### Variation A: Speed-Focused
```
Headline: "Diagnose Incidents in Seconds. Not Hours."
Subheadline: "Paste your incident. Get diagnosis in seconds."
CTA: "Diagnose Now"
```
- **Emphasis**: Speed above all
- **Best for**: Time-conscious SREs

### Variation B: Confidence-Focused
```
Headline: "Evidence Over Guesses. Diagnose with Confidence."
Subheadline: "Get root cause analysis backed by evidence, with proof and a fix plan."
CTA: "Get Diagnosis"
```
- **Emphasis**: Confidence and trust
- **Best for**: SREs burned by wrong diagnoses

### Variation C: Clarity-Focused
```
Headline: "Skip the Guesswork. Get Clear Answers Fast."
Subheadline: "Submit your incident. Get root cause, fix plan, and everything you need to recover."
CTA: "Submit Incident"
```
- **Emphasis**: Clarity and completeness
- **Best for**: SREs overwhelmed by multiple tools

---

## Visual-Copy Pairing

### Recommended: Variation A (Speed-Focused)

```
[Hero Background: Fast-moving visual - diagonal lines, motion blur, or clock imagery]

Main Headline (Large, Bold):
"Diagnose Incidents in Seconds. Not Hours."

Subheadline (Medium, Regular):
"Paste your incident. Get evidence-backed root cause with a fix plan in seconds."

Primary CTA Button (Large, High-Contrast Color):
"DIAGNOSE NOW"

Optional Secondary Link (Small, Subtle):
"See how it works ↓"
```

**Recommended Colors** (from Phase B tokens):
- **Button**: Action color (blue)
- **Headline**: Primary text (dark)
- **Subheadline**: Secondary text (medium gray)
- **Background**: Light or gradient

---

## Mobile Copy Optimization

### Desktop (1200px+)
- Full subheadline (12 words)
- Primary CTA button (full width or fixed width)
- Optional secondary CTA below
- Recommended layout: Centered

### Tablet (768px-1199px)
- Full subheadline (still readable)
- Primary CTA button (full width)
- Secondary CTA optional
- Layout: Centered or left-aligned

### Mobile (<768px)
- Headline: Keep as-is (9 words fits)
- Subheadline: May truncate or stack at 12 words (acceptable)
- Primary CTA: Full width button (100% of container)
- Secondary CTA: Hidden or below fold
- Layout: Centered, single column

---

## Copy Accessibility

### Text Length
- Headline: 9 words ✅ (short, memorable)
- Subheadline: 12 words ✅ (readable, not too long)
- CTA: 2 words ✅ (short, clear)

### Readability
- No jargon ✅
- Plain language ✅
- Active voice ✅ ("Get" not "You will receive")
- Clear benefits ✅

### Contrast
- Headline text vs. background: 4.5:1 minimum
- Subheadline text vs. background: 4.5:1 minimum
- Button text vs. background: 4.5:1 minimum

---

## Copy Approval Checklist

- [ ] Headline resonates with target user (pain point #1)
- [ ] Subheadline explains specific deliverables
- [ ] CTA button is clear and action-oriented
- [ ] No jargon or internal terminology
- [ ] Information hierarchy is clear (headline > subheadline > CTA)
- [ ] Copy fits design constraints (character counts)
- [ ] Copy pairs well with visual design
- [ ] Accessible text contrast and size
- [ ] Mobile-optimized (fits on small screens)
- [ ] Tone is professional but approachable

---

## Next Steps (A1-07 through A1-15)

### A1-07: User Validation
- Test complete hero copy structure
- Collect feedback on clarity
- Verify pain point resonance

### A1-08: Refinement
- Adjust copy based on user feedback
- Lock headline + subheadline + CTA

### A1-09 through A1-15
- CTA destinations, storyboards, metrics, accessibility, testing, final approval

---

## Sign-Off

✅ **A1-06 Complete**
- Complete hero section copy structure defined
- 4-tier copy hierarchy documented
- Copy validated against pain points
- Alternative structures provided
- Copy tone and voice defined
- Mobile optimization planned
- Accessibility standards included
- Approval checklist provided
- Ready for user validation (A1-07)

**Key Insight**: Hero copy structure has 3 core elements (Headline + Subheadline + CTA) that work together to address pain point #1 (diagnosis time pressure) while explaining specific value (seconds + evidence + fix plan).
