# A1-09: CTA Destination Strategy - Where Does User Go After Click

**Task**: Write CTA destination strategy - Where does user go after click
**Status**: ✅ COMPLETE
**Date**: 2026-03-09
**Owner**: Content Team (Team 1)
**Depends on**: A1-06 ✅ Complete

---

## CTA Destination: Diagnosis Form

### Where Does "Diagnose Now" Button Lead?

**Primary Destination**: Incident Diagnosis Form (in modal or on form page)

```
Step 1: User sees hero section
↓
Step 2: User clicks "Diagnose Now"
↓
Step 3: Form appears (modal or page scroll)
↓
Step 4: User fills in incident description
↓
Step 5: User clicks "Submit" or "Diagnose"
↓
Step 6: Loading state appears
↓
Step 7: Results displayed
```

---

## Form Specification

### Form Fields

#### Field 1: Incident Description (Required)
```
Label: "Describe your incident"
Type: Textarea
Placeholder: "What is happening? Include errors, symptoms, when it started..."
Min length: 10 characters
Max length: 2000 characters
Validation: Required, length validation
Character counter: Show 10/2000 as user types
```

#### Field 2: Severity Level (Optional)
```
Label: "How critical is this?"
Type: Radio buttons or select
Options:
  - "Critical (P1)" - System completely down
  - "High (P2)" - Major impact
  - "Medium (P3)" - Partial impact
  - "Low (P4)" - Minor issue
  - "Not sure" - Let AI assess
```

#### Field 3: Email (Optional)
```
Label: "Email for results"
Type: Email input
Placeholder: "your@company.com"
Validation: Valid email format
Purpose: Send results to inbox
```

#### Field 4: Agree to Terms (Optional)
```
Label: "Send my incident to Claude for analysis"
Type: Checkbox
Validation: Recommended but not required
Purpose: Privacy/consent confirmation
```

---

## Form Behavior

### On Load
- Focus on incident description field
- Clear placeholder text to show example
- Disable submit button until input valid
- Show character counter (0/2000)

### As User Types
- Live character counter update
- Validate minimum length (10 chars)
- Warn if approaching max (1900+ chars)
- Enable submit button when valid

### Form Submission
- Validate all required fields
- Disable submit button (prevent double-submit)
- Show loading state ("Analyzing incident...")
- Clear form errors (reset on new submit)

### Form Errors
- Show inline error messages under each field
- Highlight field with red border
- Show error icon
- Example: "Description too short (10 characters minimum)"
- Example: "Invalid email format"

---

## Success/Loading State

### After User Clicks Submit

1. **Immediate Feedback** (0-500ms)
   - Button changes to loading state
   - Loading spinner appears
   - "Analyzing incident..." message shows

2. **Progress Indication** (0-60 seconds)
   - Progress bar fills 0-100%
   - Stage indicator shows: "Router → Retriever → Skeptic → Verifier"
   - Estimated time: "About 20 seconds..."

3. **Results Display** (After API returns)
   - Form fades out
   - Results section fades in
   - Show full diagnosis output:
     - Router output (incident classification)
     - Retriever output (evidence gathered)
     - Skeptic output (alternative theory)
     - Verifier output (final root cause + confidence)

---

## Secondary CTA Destinations

### Option 1: "Learn More" (scrolls to next section)
```
Click "Learn More" → Smoothly scroll to "How It Works" section
```

### Option 2: "Watch Demo" (opens video modal)
```
Click "Watch Demo" → Modal pops up with video (5-10 minutes)
Video shows: Example incident → Diagnosis → Fix plan
```

### Option 3: "See Pricing" (goes to pricing page)
```
Click "See Pricing" → Navigate to /pricing page
Shows plans and billing info
```

---

## Mobile CTA Behavior

### Desktop (1200px+)
- Form appears in modal (center of screen)
- Modal width: 600px
- Can close modal (X button) to go back

### Tablet (768px-1199px)
- Form appears in modal
- Modal width: 90% of screen
- Can close modal

### Mobile (<768px)
- Option A: Form below hero (user scrolls down)
- Option B: Full-screen modal (takes up entire screen)
- Recommended: Option A (scroll)
- Close button visible at top

---

## Form Success Criteria

### Functional Requirements
- [ ] Form appears when "Diagnose Now" clicked
- [ ] Input validation works (min 10, max 2000 chars)
- [ ] Submit button disables during submission
- [ ] Loading state shows progress
- [ ] Results display correctly
- [ ] Form can be closed/reset

### User Experience
- [ ] Form is obviously the next step after clicking CTA
- [ ] Error messages are clear and helpful
- [ ] Loading progress gives confidence
- [ ] Results are displayed clearly
- [ ] User can submit another incident easily

### Mobile
- [ ] Form is readable on mobile (<768px)
- [ ] Keyboard doesn't cover input field
- [ ] Submit button is large enough (44px+)
- [ ] Form doesn't require horizontal scroll

---

## Error Handling

### If Form Submission Fails

**Timeout Error (>60 seconds)**
```
Message: "Request took longer than expected. Please try again."
Button: "Retry"
Option: "Cancel and go back"
```

**Network Error**
```
Message: "Network error. Please check your connection and try again."
Button: "Retry"
Option: "Cancel"
```

**Validation Error (invalid input)**
```
Message: [Field-specific error]
Example: "Incident description too short (minimum 10 characters)"
Fix: User can edit and resubmit
```

**Server Error (5xx)**
```
Message: "Server error. Please try again in a moment."
Button: "Retry"
Option: "Contact support"
```

---

## Form Integration with Existing Flow

### Current Flow
1. User on homepage
2. Clicks "Diagnose Now"
3. Form appears
4. Form submits to `/api/diagnose` endpoint
5. Results shown

### API Endpoint
```
POST /api/diagnose
Content-Type: application/json

Request Body:
{
  "incident": "description from textarea",
  "severity": "P1" (optional),
  "email": "user@company.com" (optional)
}

Response:
{
  "success": true,
  "data": {
    "router": { /* ... */ },
    "retriever": { /* ... */ },
    "skeptic": { /* ... */ },
    "verifier": { /* ... */ }
  }
}
```

---

## Form Analytics

### Metrics to Track
- [ ] Form impressions (how many times shown)
- [ ] Form submissions (how many submitted)
- [ ] Form abandonment (opened form but didn't submit)
- [ ] Submission errors (validation failures)
- [ ] Success rate (% of submissions that worked)
- [ ] Time to submit (how long user takes)

### Success Definition
- [ ] ≥20% of visitors click "Diagnose Now"
- [ ] ≥20% of form opens result in submission
- [ ] ≥90% of submissions succeed (no errors)
- [ ] Average submit time: <3 minutes

---

## Alternative Destination (Not Recommended)

### Option A: Sign-Up/Login First
```
Click "Diagnose Now" → Sign-up form appears → Then diagnosis form
```
**Pros**: Capture user email early
**Cons**: Adds friction, reduces conversion

### Option B: Product Tour First
```
Click "Diagnose Now" → Product walkthrough → Then diagnosis form
```
**Pros**: Educate user on how it works
**Cons**: Long, may cause abandonment

### Option C: Pricing/Plans First
```
Click "Diagnose Now" → Pricing page → Then diagnosis form
```
**Pros**: Show value upfront
**Cons**: Completely wrong (user wants diagnosis, not pricing)

**Recommendation**: Stick with Option A (Direct to form). Lowest friction, fastest path to value.

---

## Sign-Off

✅ **A1-09 Complete**
- Primary CTA destination defined (Diagnosis Form)
- Form specification documented (fields, validation, behavior)
- Success/loading states defined
- Mobile behavior specified
- Error handling planned
- Analytics metrics defined
- Integration with existing API endpoint documented
- Alternative destinations considered and rejected
- Ready for Phase C (form implementation)

**Key Decision**: "Diagnose Now" CTA leads directly to incident diagnosis form (lowest friction), allowing user to get diagnosis immediately without sign-up requirement.
