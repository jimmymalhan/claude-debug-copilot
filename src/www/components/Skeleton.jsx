/**
 * LS-001: Skeleton loading placeholder
 * WCAG: aria-busy, role="status"
 */
import React from 'react';

export default function Skeleton({ width, height, borderRadius = 4, className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      role="status"
      aria-busy="true"
      aria-label="Loading"
      style={{
        width: width || '100%',
        height: height || 20,
        borderRadius,
      }}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
