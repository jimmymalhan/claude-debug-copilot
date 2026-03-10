import React, { useState } from 'react'

const MAX_LENGTH = 2000
const MIN_LENGTH = 10

export default function DiagnosisForm({ onSubmit }) {
  const [incident, setIncident] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [charCount, setCharCount] = useState(0)

  const handleChange = (e) => {
    const value = e.target.value
    setIncident(value)
    setCharCount(value.length)
    setIsValid(value.length >= MIN_LENGTH && value.length <= MAX_LENGTH)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isValid) {
      onSubmit(incident)
    }
  }

  const percentage = (charCount / MAX_LENGTH) * 100

  return (
    <div className="diagnosis-form-container">
      <div className="form-header">
        <h1>Diagnose Your Incident</h1>
        <p>Describe what's happening and get instant root cause analysis with a fix plan.</p>
      </div>

      <form onSubmit={handleSubmit} className="diagnosis-form">
        <div className="form-group">
          <label htmlFor="incident" className="form-label">
            What's the problem?
          </label>

          <div className="textarea-wrapper">
            <textarea
              id="incident"
              className="form-textarea"
              placeholder="Example: Database queries are timing out. API responses went from 2s to 45s. Error rate at 15%."
              value={incident}
              onChange={handleChange}
              minLength={MIN_LENGTH}
              maxLength={MAX_LENGTH}
            />
            <div className="char-counter">
              <span>{charCount}</span>
              <span className="separator">/</span>
              <span className="max">{MAX_LENGTH}</span>
            </div>
          </div>

          <div className="progress-bar">
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

          {charCount < MIN_LENGTH && (
            <p className="form-hint error">
              Need at least {MIN_LENGTH - charCount} more characters
            </p>
          )}
          {charCount >= MIN_LENGTH && charCount <= MAX_LENGTH && (
            <p className="form-hint success">
              ✓ Ready to submit
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-submit"
          disabled={!isValid}
        >
          <span className="btn-text">Analyze Incident</span>
          <span className="btn-icon">→</span>
        </button>
      </form>

      <div className="form-features">
        <div className="feature">
          <span className="feature-icon">⚡</span>
          <p>16-30 second diagnosis</p>
        </div>
        <div className="feature">
          <span className="feature-icon">🎯</span>
          <p>94% confidence</p>
        </div>
        <div className="feature">
          <span className="feature-icon">📊</span>
          <p>Complete analysis</p>
        </div>
      </div>
    </div>
  )
}
