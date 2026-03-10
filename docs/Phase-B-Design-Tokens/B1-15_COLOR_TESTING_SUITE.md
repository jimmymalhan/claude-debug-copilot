# B1-15: Color Testing Suite & Validation

## Overview
Complete testing strategy for color system validation and quality assurance.

## Unit Tests

### Contrast Ratio Tests
```javascript
describe('Color Contrast', () => {
  it('should meet WCAG AA for primary text', () => {
    const ratio = getContrastRatio('#111827', '#FFFFFF');
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('should meet WCAG AAA for headings', () => {
    const ratio = getContrastRatio('#111827', '#FFFFFF');
    expect(ratio).toBeGreaterThanOrEqual(7);
  });
});
```

### Color Definition Tests
```javascript
describe('Color Variables', () => {
  it('should have all primary colors defined', () => {
    const colors = getCSSVariables(':root');
    expect(colors).toHaveProperty('--color-primary-50');
    expect(colors).toHaveProperty('--color-primary-500');
  });

  it('should have valid hex values', () => {
    const primary = getCSSVariable('--color-primary-500');
    expect(primary).toMatch(/^#[0-9A-F]{6}$/i);
  });
});
```

## Visual Regression Tests

### Component Color Tests
```javascript
describe('Button Colors', () => {
  it('should render with correct primary background', () => {
    render(<Button variant="primary">Click me</Button>);
    const button = screen.getByRole('button');
    const bgColor = window.getComputedStyle(button).backgroundColor;
    expect(bgColor).toBe('rgb(79, 70, 229)');
  });

  it('should change color on hover', () => {
    render(<Button variant="primary">Click me</Button>);
    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    const bgColor = window.getComputedStyle(button).backgroundColor;
    expect(bgColor).toBe('rgb(67, 56, 202)');
  });
});
```

## Accessibility Tests

### Colorblind Simulation
```javascript
describe('Colorblind Accessibility', () => {
  it('should be distinguishable in protanopia', () => {
    const simulated = simulateColorblind('#10B981', 'protanopia');
    expect(simulated).not.toBe('#DC2626'); // Success != Error
  });

  it('should use text labels with colors', () => {
    render(<Alert status="success">Request approved</Alert>);
    expect(screen.getByText('Request approved')).toBeInTheDocument();
  });
});
```

### WCAG Tests
```javascript
describe('WCAG AA Compliance', () => {
  it('should meet contrast requirements', async () => {
    const results = await axe(document);
    const colorContrast = results.violations.filter(v => v.id === 'color-contrast');
    expect(colorContrast).toHaveLength(0);
  });
});
```

## Integration Tests

### Theme Toggle Tests
```javascript
describe('Theme System', () => {
  it('should toggle between light and dark themes', () => {
    render(<App />);
    const toggle = screen.getByRole('button', { name: /toggle theme/i });

    fireEvent.click(toggle);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    fireEvent.click(toggle);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should persist theme preference', () => {
    render(<App />);
    const toggle = screen.getByRole('button', { name: /toggle theme/i });

    fireEvent.click(toggle);
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
```

## E2E Tests

### Manual Testing Checklist
- [ ] All colors display correctly in Chrome
- [ ] All colors display correctly in Safari
- [ ] All colors display correctly in Firefox
- [ ] Dark theme colors accurate
- [ ] Light theme colors accurate
- [ ] Contrast ratios verified
- [ ] Theme toggle works smoothly
- [ ] No color flicker on page load
- [ ] Focus rings visible
- [ ] Colorblind simulation passes

### Device Testing
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

## Performance Tests

### CSS Variable Performance
```javascript
describe('CSS Variable Performance', () => {
  it('should update colors without reflow', () => {
    const start = performance.now();
    document.documentElement.style.setProperty('--color-primary-500', '#FF0000');
    const end = performance.now();

    expect(end - start).toBeLessThan(1); // < 1ms
  });
});
```

## Automated Test Suite
```bash
# Run all color tests
npm test -- --testPathPattern=color

# Run with coverage
npm test -- --testPathPattern=color --coverage

# Run contrast checker
npm run test:contrast
```

## Testing Tools

### Manual Tools
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Colorblind Simulator: https://www.color-blindness.com/coblis-color-blindness-simulator/
- Chrome DevTools (Accessibility tab)

### Automated Tools
- axe-core (WCAG testing)
- jest-axe (React testing)
- pa11y (CLI accessibility)

## Continuous Testing
- Run color tests on every commit (CI/CD)
- Run accessibility tests on pull requests
- Visual regression testing on main
- Performance monitoring on deploy

---
**Status**: ✓ Complete | **Phase**: B1 | **Date**: 2026-03-10
