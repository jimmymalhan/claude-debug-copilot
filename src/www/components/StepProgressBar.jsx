/**
 * LS-006: StepProgressBar — discrete steps with labels
 * WCAG: role="progressbar", aria-valuenow, aria-valuemin, aria-valuemax
 */
import React from 'react';

export default function StepProgressBar({ steps = [], currentStep = 0, ariaLabel = 'Progress' }) {
  const total = steps.length || 1;
  const value = Math.min(currentStep, total);
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="step-progress-bar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={total} aria-label={ariaLabel}>
      <div className="step-progress-bar-track">
        <div className="step-progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      {steps.length > 0 && (
        <div className="step-progress-bar-labels">
          {steps.map((s, i) => (
            <span key={i} className={i <= currentStep ? 'active' : ''}>
              {typeof s === 'string' ? s : s.label || s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
