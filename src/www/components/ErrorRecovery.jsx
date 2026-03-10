import React from 'react'

const ERROR_ICONS = {
  network_error: '🌐',
  timeout_error: '⏱️',
  validation_error: '✏️',
  server_error: '⚙️',
  unknown_error: '⚠️'
}

const ERROR_TITLES = {
  network_error: 'Connection Error',
  timeout_error: 'Request Timeout',
  validation_error: 'Invalid Input',
  server_error: 'Server Error',
  unknown_error: 'Error Occurred'
}

export default function ErrorRecovery({ error, onRetry, retryCount = 0 }) {
  const errorType = error.errorType || 'unknown_error'
  const icon = ERROR_ICONS[errorType] || ERROR_ICONS.unknown_error
  const title = ERROR_TITLES[errorType] || ERROR_TITLES.unknown_error

  return (
    <div className="error-recovery" role="alert" aria-live="assertive" aria-atomic="true">
      <div className="error-recovery-card">
        <div className="error-header">
          <span className="error-icon" aria-hidden="true">{icon}</span>
          <h3>{title}</h3>
        </div>

        <div className="error-content">
          <p className="error-message">{error.message}</p>
        </div>

        {error.retryable && (
          <div className="error-actions">
            <button
              className="btn btn-primary"
              onClick={onRetry}
              aria-label={`Retry analysis${retryCount > 0 ? ` (attempt ${retryCount + 1})` : ''}`}
            >
              {retryCount > 0 ? `Retry (Attempt ${retryCount + 1})` : 'Retry'}
            </button>
          </div>
        )}

        {!error.retryable && (
          <p className="error-note">This error cannot be retried. Please check your input and try again.</p>
        )}
      </div>
    </div>
  )
}
