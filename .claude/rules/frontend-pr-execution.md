# Frontend PR Execution Guardrails - Premium Upgrade

## Scope Boundaries

### In Scope (500+ tasks, 10 days)
- ✅ Design tokens (colors, typography, motion, spacing)
- ✅ React integration with Context API
- ✅ Homepage refactor (hero, how-it-works, value prop)
- ✅ Dark theme with persistence
- ✅ Loading states and skeleton screens
- ✅ Error handling and retry UI
- ✅ Motion architecture and animations
- ✅ Accessibility (WCAG AA)
- ✅ Performance optimization
- ✅ Component tests, E2E tests
- ✅ Documentation and migration guide

### Out of Scope (Post-Launch)
- ❌ TypeScript conversion (optional v2)
- ❌ Storybook setup (not required for MVP)
- ❌ Internationalization/i18n
- ❌ Advanced animations (Framer Motion integration)
- ❌ Database/persistence changes
- ❌ Backend API changes (use existing)
- ❌ Mobile app (web only)
- ❌ Analytics integration

---

## Code Quality Standards

### What Must Pass Before Merge
1. **Tests**: `npm test` shows ≥85% coverage
2. **CI**: GitHub Actions all green
3. **Lighthouse**: ≥90 score
4. **Accessibility**: axe-core scan with 0 violations
5. **Performance**: LCP <2.5s, FID <100ms, CLS <0.1
6. **Manual Testing**: All critical flows verified on localhost
7. **Browser Testing**: Chrome, Safari, Firefox all pass
8. **Responsive**: Desktop (1200px+), Tablet (768px-1199px), Mobile (<768px) all verified

### What Must NOT Enter Production
- ❌ Debug statements or console.logs (removed before merge)
- ❌ Hardcoded credentials or API keys
- ❌ Unfinished features or TODOs
- ❌ Browser-specific hacks without fallbacks
- ❌ Performance regressions (measured with Lighthouse)
- ❌ Accessibility violations (WCAG AA minimum)
- ❌ Untested error paths

---

## Breaking Changes

### If Your Changes Break Existing Code
1. **Identify the break**: Which existing feature fails?
2. **Assess impact**: How many users affected?
3. **Fix it immediately**: Update both old and new code
4. **Update CHANGELOG**: Document what broke and fix
5. **Test the fix**: Verify existing workflows still work

### Non-Breaking Examples
✅ Adding new React components (existing HTML/CSS unchanged)
✅ Adding design tokens (no required usage)
✅ Adding dark theme (light theme still default)
✅ Improving error handling (still catches same errors)
✅ Refactoring internal styles (output looks same)

### Breaking Examples
❌ Removing existing endpoints (without redirect)
❌ Changing form field names (breaks validation)
❌ Removing CSS classes (breaks existing custom CSS)
❌ Changing component prop names (breaks existing usage)
❌ Moving files without symlinks (breaks imports)

---

## Testing Requirements

### Unit Tests (Phase F, Day 8)
```javascript
describe('Module', () => {
  it('should do happy path', () => { })
  it('should handle error case', () => { })
  it('should validate input', () => { })
  it('should respect prefers-reduced-motion', () => { })
})
```

**Coverage minimums**:
- Design tokens: 100%
- Motion utilities: 100%
- API client: 90%
- Components: 85%

### Component Tests (Phase F, Day 8)
```javascript
describe('Component', () => {
  it('should render with default props', () => { })
  it('should accept custom props', () => { })
  it('should handle user interaction', () => { })
  it('should be keyboard accessible', () => { })
  it('should be screen reader friendly', () => { })
})
```

### E2E Tests (Phase F, Day 9)
```javascript
describe('Critical workflow', () => {
  it('user can submit incident', () => { })
  it('user sees loading state', () => { })
  it('user sees results', () => { })
  it('user can retry on error', () => { })
  it('user can toggle theme', () => { })
})
```

### Manual Testing Checklist
- [ ] Form submission works on localhost:3000
- [ ] Loading state appears and disappears
- [ ] Results display correctly
- [ ] Error state shows and allows retry
- [ ] Dark theme toggles and persists
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Mobile layout (responsive <768px)
- [ ] Tablet layout (responsive 768-1199px)
- [ ] Desktop layout (responsive 1200px+)
- [ ] All animations 60 FPS (DevTools > Rendering)

---

## Commit Guidelines

### Commit Format
```
<type>: <subject>

<body>

<footer>
```

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code reorganization
- `test`: Test additions
- `docs`: Documentation
- `style`: Formatting only
- `perf`: Performance improvement

### Example Commits
```
feat: Add design token system for colors, typography, motion

- Create src/www/design-tokens.js with complete token set
- Add color palette (light/dark themes)
- Add typography scale (h1-h6, body, caption)
- Add motion tokens (quick, smooth, dramatic)
- Tests: verify token values are valid CSS
- Docs: token usage guide in CLAUDE.md

[Phase B] Design Tokens Foundation
```

### Commits Must Include
- ✅ What changed and why
- ✅ Test results (`npm test` output if added tests)
- ✅ Breaking changes (if any)
- ✅ Phase/milestone reference
- ✅ Files modified list

### Commits Must NOT Include
- ❌ Debug code or console.logs
- ❌ Credentials or API keys
- ❌ Unfinished work (use draft PRs instead)
- ❌ Multiple unrelated changes
- ❌ Large refactors mixed with features

---

## Performance Budgets

### CSS Bundle
- Target: <50KB (minified)
- Includes: Design tokens, motion utilities, component styles
- Alert if: ≥75KB

### JS Bundle
- Target: <200KB (minified)
- Includes: React, context, utilities, components
- Alert if: ≥300KB

### Images/Media
- Target: <100KB total
- Rule: Lazy load images, use srcset
- Format: WebP with fallback

### Lighthouse Score
- Target: ≥90
- Components:
  - Performance: ≥90
  - Accessibility: ≥90
  - Best Practices: ≥90
  - SEO: ≥90

### Web Vitals
- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1

---

## Accessibility Standards

### WCAG AA Compliance (Minimum)
- [ ] Color contrast ≥4.5:1 for text
- [ ] Color contrast ≥3:1 for UI components
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus indicators visible
- [ ] ARIA labels on all form fields
- [ ] ARIA live regions for dynamic content
- [ ] Alt text on all images
- [ ] Heading hierarchy logical (h1→h2→h3)

### Special Requirements
- [ ] prefers-reduced-motion respected (disable animations)
- [ ] prefers-color-scheme auto-detect dark mode
- [ ] prefers-contrast supported (if possible)
- [ ] Mobile touch targets ≥44px minimum
- [ ] Button text clear without icons alone

---

## Branch Protection

### Feature Branch Rules
- Branch: `feature/integration-website`
- Auto-accept: All changes (no permission prompts)
- Allowed: File edits, commits, pushes
- Denied: Force pushes, history rewrites
- Status: 🟢 ACTIVE

### Main Branch Protection
- Requires: All tests passing
- Requires: Code review (2 reviewers)
- Requires: No breaking changes
- Blocks: Direct commits (PR only)
- Requires: Documentation updates

---

## Known Issues & Mitigations

### Issue 1: Design System Inconsistency
**Risk**: Colors, spacing, motion hardcoded in multiple places
**Mitigation**: Phase B creates single source of truth (tokens.js)
**Test**: Search codebase for hardcoded values after Phase B

### Issue 2: Animation Performance
**Risk**: Too many simultaneous animations cause jank
**Mitigation**: Phase D includes 60 FPS profiling, remove animations if needed on mobile
**Test**: DevTools > Rendering tab on mobile, target 60 FPS

### Issue 3: React Context Overkill
**Risk**: Context re-renders entire tree on small changes
**Mitigation**: Split contexts by concern (Theme, UIState, Form)
**Test**: Measure re-renders with React DevTools Profiler

### Issue 4: API Timeout Edge Cases
**Risk**: Network timeout during long diagnosis operation
**Mitigation**: Phase E implements timeout handling + manual retry
**Test**: Mock network timeout, verify user can retry

### Issue 5: Dark Theme Contrast
**Risk**: Dark background makes text hard to read
**Mitigation**: Phase G tests with axe-core, adjust colors if needed
**Test**: Run `npm run test:a11y` after Phase G

---

## When Things Go Wrong

### Test Fails
1. Run `npm test -- --testNamePattern="test name"` locally
2. Debug with console.logs or debugger
3. Fix code, re-run test
4. Document root cause in CHANGELOG
5. Push fix in new commit

### Lighthouse Score Drops
1. Run `npm run lighthouse` locally
2. Identify which metric dropped (performance/a11y/etc)
3. Profile with DevTools (Perf tab)
4. Fix root cause
5. Re-run and verify improvement

### Accessibility Issue Found
1. Run `npm run test:a11y` (axe-core scan)
2. Fix ARIA labels, keyboard nav, or contrast
3. Re-run scan
4. Document fix in CHANGELOG
5. Update acceptance criteria

### Performance Regression
1. Identify what changed (git diff)
2. Revert change or optimize
3. Profile with DevTools
4. Measure improvement
5. Document in commit message

### Branch Conflicts
1. Switch to main: `git checkout main`
2. Fetch latest: `git fetch origin`
3. Pull latest: `git pull origin main`
4. Switch back to branch: `git checkout feature/integration-website`
5. Rebase: `git rebase main`
6. Resolve conflicts (keep our changes)
7. Force push: `git push origin feature/integration-website --force`

---

## Definition of Done

A task is complete when:
- [ ] Code changes committed
- [ ] Tests written and passing
- [ ] No console errors or warnings
- [ ] Lighthouse/Performance verified
- [ ] Accessibility verified (axe-core)
- [ ] CHANGELOG updated
- [ ] CHANGELOG.md documented
- [ ] Ready for next phase

A phase is complete when:
- [ ] All tasks in phase committed
- [ ] All tests passing
- [ ] Documentation written
- [ ] Stakeholder feedback collected
- [ ] Sign-off from phase owner
- [ ] Ready for next phase (or merge)

---

## Post-Launch Improvements

These are good ideas but out of scope for v1:
- [ ] TypeScript conversion
- [ ] Storybook component library
- [ ] Framer Motion advanced animations
- [ ] Analytics tracking
- [ ] A/B testing framework
- [ ] Internationalization (i18n)
- [ ] Advanced performance metrics
- [ ] Custom CSS-in-JS solution

Document in ROADMAP.md for future discussion.
