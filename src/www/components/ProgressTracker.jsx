import React, { useState, useEffect } from 'react'

const STAGES = [
  { name: 'Router', color: '#0071e3', icon: '🔀' },
  { name: 'Retriever', color: '#34c759', icon: '📋' },
  { name: 'Skeptic', color: '#ff9500', icon: '🤔' },
  { name: 'Verifier', color: '#af52de', icon: '✓' }
]

export default function ProgressTracker({ currentStage = 0 }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [progress, setProgress] = useState(0)

  // Increment elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Update progress based on elapsed time (reaches 90% max during loading)
  useEffect(() => {
    const targetProgress = Math.min((elapsedSeconds / 30) * 90, 90)
    setProgress(targetProgress)
  }, [elapsedSeconds])

  return (
    <div className="progress-tracker" role="status" aria-live="polite" aria-label="Analysis progress">
      <div className="progress-tracker-header">
        <h2>Analyzing Incident</h2>
        <p className="progress-subtitle">Running diagnosis pipeline</p>
      </div>

      {/* Progress Bar */}
      <div className="progress-tracker-bar-container">
        <div className="progress-tracker-bar" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-tracker-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="progress-percentage">{Math.round(progress)}%</p>
      </div>

      {/* Stages */}
      <div className="progress-stages">
        {STAGES.map((stage, index) => (
          <div
            key={stage.name}
            className={`progress-stage ${index < currentStage ? 'completed' : index === currentStage ? 'active' : 'pending'}`}
            role="listitem"
          >
            <div
              className="stage-circle"
              style={{
                backgroundColor: index < currentStage || index === currentStage ? stage.color : 'var(--bg-tertiary)',
                borderColor: stage.color
              }}
              aria-hidden="true"
            >
              {index < currentStage ? '✓' : stage.icon}
            </div>
            <span className="stage-label">{stage.name}</span>
          </div>
        ))}
      </div>

      {/* Elapsed Time */}
      <div className="progress-info">
        <p>Elapsed time: <span className="time-value">{elapsedSeconds}s</span></p>
        <p className="time-estimate">Typical duration: 16-30 seconds</p>
      </div>
    </div>
  )
}
