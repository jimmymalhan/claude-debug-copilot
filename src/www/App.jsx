import React, { useState, useCallback, useEffect } from 'react'
import DiagnosisForm from './components/DiagnosisForm'
import ResultsDisplay from './components/ResultsDisplay'
import DashboardPanel from './components/DashboardPanel'
import NavigationBar from './components/NavigationBar'
import LoadingOverlay from './components/LoadingOverlay'
import ErrorBoundary from './components/ErrorBoundary'
import './styles/app.css'

export default function App() {
  const [stage, setStage] = useState('form') // form, loading, results, error
  const [diagnosis, setDiagnosis] = useState(null)
  const [error, setError] = useState(null)
  const [showDashboard, setShowDashboard] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)

  // Fetch dashboard data
  useEffect(() => {
    if (showDashboard) {
      fetchDashboard()
    }
  }, [showDashboard])

  const fetchDashboard = async () => {
    try {
      const response = await fetch('/api/dashboard')
      const data = await response.json()
      setDashboardData(data)
    } catch (err) {
      console.error('Dashboard error:', err)
    }
  }

  const handleSubmit = useCallback(async (incident) => {
    if (!incident || incident.length < 10) {
      setError('Incident description must be at least 10 characters')
      setStage('error')
      return
    }

    setStage('loading')
    setError(null)

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incident })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to diagnose')
      }

      const data = await response.json()
      setDiagnosis(data)
      setStage('results')
    } catch (err) {
      setError(err.message)
      setStage('error')
    }
  }, [])

  const handleReset = useCallback(() => {
    setStage('form')
    setDiagnosis(null)
    setError(null)
  }, [])

  const handleExport = useCallback((format = 'json') => {
    if (!diagnosis) return

    if (format === 'json') {
      const dataStr = JSON.stringify(diagnosis, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `diagnosis-${Date.now()}.json`
      link.click()
    }
  }, [diagnosis])

  return (
    <ErrorBoundary>
      <div className="app">
        <NavigationBar
          onDashboardToggle={() => setShowDashboard(!showDashboard)}
          showDashboard={showDashboard}
        />

        <main className="app-main">
          {stage === 'loading' && <LoadingOverlay />}

          <div className="app-container">
            {stage === 'form' && (
              <DiagnosisForm onSubmit={handleSubmit} />
            )}

            {stage === 'results' && diagnosis && (
              <ResultsDisplay
                diagnosis={diagnosis}
                onReset={handleReset}
                onExport={handleExport}
              />
            )}

            {stage === 'error' && (
              <div className="error-container">
                <div className="error-box">
                  <div className="error-icon">⚠️</div>
                  <h2>Error</h2>
                  <p>{error}</p>
                  <button className="btn btn-primary" onClick={handleReset}>
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {showDashboard && dashboardData && (
              <DashboardPanel data={dashboardData} />
            )}
          </div>
        </main>

        <footer className="app-footer">
          <p>Claude Debug Copilot v3.0 — Production-Ready Incident Diagnosis</p>
          <p>© 2026 All rights reserved</p>
        </footer>
      </div>
    </ErrorBoundary>
  )
}
