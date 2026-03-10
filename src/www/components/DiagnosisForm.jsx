import React, { useState, useRef, useEffect } from 'react'
import ProgressTracker from './ProgressTracker'
import ErrorRecovery from './ErrorRecovery'

const MAX_LENGTH = 2000
const MIN_LENGTH = 10

export default function DiagnosisForm({ onSubmit, resetKey }) {
  const [incident, setIncident] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [validationState, setValidationState] = useState('empty')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (resetKey) {
      setIncident('')
      setCharCount(0)
      setIsValid(false)
      setValidationState('empty')
      setIsLoading(false)
      setError(null)
      setRetryCount(0)
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }
  }, [resetKey])

  const handleChange = (e) => {
    const value = e.target.value
    setIncident(value)
    setCharCount(value.length)

    // Calculate validation state
    if (value.length === 0) {
      setValidationState('empty')
      setIsValid(false)
    } else if (value.length < MIN_LENGTH) {
      setValidationState('invalid')
      setIsValid(false)
    } else if (value.length <= MAX_LENGTH) {
      setValidationState('valid')
      setIsValid(true)
    } else {
      setValidationState('overflow')
      setIsValid(false)
    }

    // Clear error when user starts typing valid input
    if (error && value.length >= MIN_LENGTH) {
      setError(null)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isValid && !isLoading) {
      setIsLoading(true)
      setError(null)
      onSubmit(incident, {
        onSuccess: handleSuccess,
        onError: handleError
      })
    }
  }

  const handleSuccess = () => {
    setIsLoading(false)
    setIncident('')
    setCharCount(0)
    setValidationState('empty')
    setRetryCount(0)
  }

  const handleError = (errorData) => {
    setIsLoading(false)
    setError({
      message: errorData.message || 'An error occurred during analysis',
      errorType: errorData.errorType || 'unknown_error',
      retryable: errorData.retryable !== false
    })
  }

  const handleRetry = () => {
    setError(null)
    setRetryCount(prev => prev + 1)
    setIsLoading(true)
    onSubmit(incident, {
      onSuccess: handleSuccess,
      onError: handleError
    })
  }

  const percentage = (charCount / MAX_LENGTH) * 100

  const validationMessage = charCount === 0
    ? `Enter at least ${MIN_LENGTH} characters to describe your incident`
    : charCount < MIN_LENGTH
      ? `Need at least ${MIN_LENGTH - charCount} more characters`
      : charCount >= MAX_LENGTH
        ? 'Maximum length reached'
        : 'Ready to submit'

  // Validation class for textarea
  const getValidationClass = () => {
    if (validationState === 'valid') return 'valid'
    if (validationState === 'invalid') return 'invalid'
    if (validationState === 'overflow') return 'invalid'
    return ''
  }

  if (isLoading) {
    return <ProgressTracker />
  }

  return (
    <div className="diagnosis-form-container" role="region" aria-label="Incident diagnosis form">
      <div className="form-header">
        <h1>Diagnose Your Incident</h1>
        <p>Describe what's happening and get instant root cause analysis with a fix plan.</p>
      </div>

      {error && (
        <ErrorRecovery
          error={error}
          onRetry={handleRetry}
          retryCount={retryCount}
        />
      )}

      <form onSubmit={handleSubmit} className="diagnosis-form" aria-label="Diagnosis submission form">
        <div className="form-group">
          <label htmlFor="incident" className="form-label">
            What's the problem?
          </label>

          <div className="textarea-wrapper">
            <textarea
              ref={textareaRef}
              id="incident"
              className={`form-textarea ${getValidationClass()}`}
              placeholder="Example: Database queries are timing out. API responses went from 2s to 45s. Error rate at 15%."
              value={incident}
              onChange={handleChange}
              minLength={MIN_LENGTH}
              maxLength={MAX_LENGTH}
              aria-describedby="incident-hint incident-counter"
              aria-invalid={validationState === 'invalid' || validationState === 'overflow'}
              aria-required="true"
              disabled={isLoading}
            />
            <div className="char-counter" id="incident-counter" aria-live="polite">
              <span>{charCount}</span>
              <span className="separator">/</span>
              <span className="max">{MAX_LENGTH}</span>
            </div>
            {validationState === 'valid' && (
              <div className="validation-checkmark" aria-hidden="true">✓</div>
            )}
          </div>

          <div className="progress-bar" role="progressbar" aria-valuenow={charCount} aria-valuemin={0} aria-valuemax={MAX_LENGTH}>
            <div
              className={`progress-fill ${
                charCount < MIN_LENGTH
                  ? 'insufficient'
                  : charCount < MAX_LENGTH
                    ? 'valid'
                    : 'full'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          <p
            id="incident-hint"
            className={`form-hint ${validationState === 'valid' ? 'success' : validationState !== 'empty' ? 'error' : ''}`}
            role="status"
            aria-live="polite"
          >
            {validationState === 'valid' ? '✓ ' : ''}{validationMessage}
          </p>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-submit"
          disabled={!isValid || isLoading}
          aria-label={isValid ? 'Submit incident for analysis' : 'Enter a valid incident description to submit'}
        >
          <span className="btn-text">{isLoading ? 'Analyzing' : 'Analyze Incident'}</span>
          <span className="btn-icon">{isLoading ? '⏳' : '→'}</span>
        </button>
      </form>

      <div className="form-features" role="list" aria-label="Analysis features">
        <div className="feature" role="listitem">
          <span className="feature-icon" aria-hidden="true">⚡</span>
          <p>16-30 second diagnosis</p>
        </div>
        <div className="feature" role="listitem">
          <span className="feature-icon" aria-hidden="true">🎯</span>
          <p>94% confidence</p>
        </div>
        <div className="feature" role="listitem">
          <span className="feature-icon" aria-hidden="true">📊</span>
          <p>Complete analysis</p>
        </div>
      </div>
    </div>
  )
}
