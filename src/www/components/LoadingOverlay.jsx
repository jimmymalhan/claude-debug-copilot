import React, { useState, useEffect } from 'react'

const STAGES = [
  { name: 'Router', emoji: '🔍', delay: 0 },
  { name: 'Retriever', emoji: '📋', delay: 1000 },
  { name: 'Skeptic', emoji: '🤔', delay: 2000 },
  { name: 'Verifier', emoji: '✓', delay: 3000 }
]

export default function LoadingOverlay() {
  const [completedStages, setCompletedStages] = useState([])

  useEffect(() => {
    STAGES.forEach((stage, idx) => {
      setTimeout(() => {
        setCompletedStages(prev => [...prev, idx])
      }, stage.delay)
    })
  }, [])

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <h2>Analyzing Your Incident</h2>

        <div className="loading-pipeline">
          {STAGES.map((stage, idx) => (
            <div key={idx} className={`loading-stage ${completedStages.includes(idx) ? 'completed' : ''}`}>
              <div className="stage-indicator">
                {completedStages.includes(idx) ? (
                  <span className="stage-check">✓</span>
                ) : (
                  <span className="stage-spinner"></span>
                )}
              </div>
              <span className="stage-name">{stage.emoji} {stage.name}</span>
            </div>
          ))}
        </div>

        <p className="loading-message">
          Running 4-agent pipeline to find the root cause...
        </p>

        <div className="loading-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${(completedStages.length / STAGES.length) * 100}%`
              }}
            ></div>
          </div>
          <span className="progress-text">
            {completedStages.length}/{STAGES.length} stages
          </span>
        </div>
      </div>
    </div>
  )
}
