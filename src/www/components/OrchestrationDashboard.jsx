import React, { useEffect, useState, useCallback } from 'react'
import { getClient } from '../api/client'
import { classifyError } from '../api/errors'
import Skeleton from './Skeleton'

const apiClient = getClient()

function SkeletonList({ count = 3 }) {
  return (
    <div className="skeleton-list" role="status" aria-live="polite" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} height={24} className="skeleton-list-item" />
      ))}
    </div>
  )
}

function LoadingState({ label }) {
  return (
    <div className="orch-section-loading" role="status" aria-live="polite">
      <SkeletonList count={3} />
      <p>{label}</p>
    </div>
  )
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="orch-section-error" role="alert" aria-live="assertive">
      <div className="orch-error-header">
        <span className="orch-error-icon" aria-hidden="true">⚠️</span>
        <div>
          <h4>Unable to load orchestration data</h4>
          <p>{error?.message || 'An unexpected error occurred while loading orchestration state.'}</p>
          {error?.suggestion && <p className="orch-error-suggestion">{error.suggestion}</p>}
        </div>
      </div>
      {onRetry && (
        <div className="orch-error-actions">
          <button className="btn btn-secondary" type="button" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}
    </div>
  )
}

function TasksSection({ tasks, loading, error, onRetry }) {
  if (loading) return <LoadingState label="Loading tasks..." />
  if (error) return <ErrorState error={error} onRetry={onRetry} />

  if (!tasks || tasks.length === 0) {
    return (
      <div className="orch-empty">
        <p>No orchestration tasks yet. Run a diagnosis to create a task.</p>
      </div>
    )
  }

  return (
    <div className="orch-tasks-grid" role="region" aria-label="Orchestration tasks">
      {tasks.map(task => (
        <article key={task.id || task.taskId} className="orch-card">
          <header className="orch-card-header">
            <div>
              <h4>{task.type || 'debug'}</h4>
              <code className="orch-task-id">
                {task.id || task.taskId}
              </code>
            </div>
            <span className={`orch-pill orch-pill-${task.status || 'unknown'}`}>
              {task.status || 'unknown'}
            </span>
          </header>
          <dl className="orch-metadata">
            <div>
              <dt>Source</dt>
              <dd>{task.metadata?.source || 'http_api'}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{task.createdAt ? new Date(task.createdAt).toLocaleString() : '—'}</dd>
            </div>
            <div>
              <dt>Last Update</dt>
              <dd>{task.updatedAt ? new Date(task.updatedAt).toLocaleString() : '—'}</dd>
            </div>
          </dl>
          {task.stateMachine && (
            <div className="orch-state">
              <p className="orch-state-label">Approval state</p>
              <p className="orch-state-value">
                {task.stateMachine.state || 'unknown'}
              </p>
            </div>
          )}
        </article>
      ))}
    </div>
  )
}

function ApprovalsSection({ approvals, loading, error, onRetry }) {
  if (loading) return <LoadingState label="Loading approvals..." />
  if (error) return <ErrorState error={error} onRetry={onRetry} />

  if (!approvals || approvals.length === 0) {
    return (
      <div className="orch-empty">
        <p>No approvals waiting. All tasks are either pending agents or already decided.</p>
      </div>
    )
  }

  return (
    <div className="orch-approvals-list" role="region" aria-label="Pending approvals">
      {approvals.map(item => (
        <article key={`${item.taskId}-${item.state}`} className="orch-card">
          <header className="orch-card-header">
            <div>
              <h4>Approval required</h4>
              <code className="orch-task-id">{item.taskId}</code>
            </div>
            <span className="orch-pill orch-pill-pending">
              {item.state || 'awaiting_approver'}
            </span>
          </header>
          <p className="orch-approval-summary">
            {item.summary || 'This task is waiting for a human approver before execution continues.'}
          </p>
          <dl className="orch-metadata">
            <div>
              <dt>Task type</dt>
              <dd>{item.taskType || 'debug'}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}</dd>
            </div>
            <div>
              <dt>Due by</dt>
              <dd>{item.dueAt ? new Date(item.dueAt).toLocaleString() : '—'}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  )
}

function AgentsSection({ orchestrationStats }) {
  if (!orchestrationStats) {
    return (
      <div className="orch-empty">
        <p>Orchestrator has not started yet. It will initialize automatically on the first diagnosis.</p>
      </div>
    )
  }

  const { isInitialized, taskCount, budgetStatus, heartbeatStatus } = orchestrationStats

  return (
    <div className="orch-agents-grid" role="region" aria-label="Orchestration status">
      <div className="orch-stat-card">
        <p className="orch-stat-label">Orchestrator</p>
        <p className={`orch-stat-value ${isInitialized ? 'orch-status-ready' : 'orch-status-off'}`}>
          {isInitialized ? 'Active' : 'Offline'}
        </p>
      </div>
      <div className="orch-stat-card">
        <p className="orch-stat-label">Total Tasks</p>
        <p className="orch-stat-value">{taskCount ?? 0}</p>
      </div>
      <div className="orch-stat-card">
        <p className="orch-stat-label">Heartbeat Agents</p>
        <p className="orch-stat-value">{heartbeatStatus ?? 0}</p>
      </div>
      <div className="orch-stat-card">
        <p className="orch-stat-label">Budget Used</p>
        <p className="orch-stat-value">
          {budgetStatus
            ? `${budgetStatus.used ?? 0}/${budgetStatus.limit ?? '—'}`
            : '—'}
        </p>
      </div>
    </div>
  )
}

function AuditSection({ events, loading, error, onRetry }) {
  if (loading) return <LoadingState label="Loading orchestration audit..." />
  if (error) return <ErrorState error={error} onRetry={onRetry} />

  if (!events || events.length === 0) {
    return (
      <div className="orch-empty">
        <p>No orchestration audit events yet.</p>
      </div>
    )
  }

  return (
    <div className="orch-audit-list" role="region" aria-label="Orchestration audit trail">
      <ul>
        {events.slice(0, 20).map((event, index) => (
          <li key={event.id || index} className="orch-audit-item">
            <div className="orch-audit-meta">
              <span className="orch-audit-time">
                {event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : '—'}
              </span>
              {event.level && (
                <span className={`orch-audit-level orch-audit-level-${event.level.toLowerCase()}`}>
                  {event.level}
                </span>
              )}
            </div>
            <p className="orch-audit-message">{event.message || event.action || 'Event'}</p>
            {event.taskId && (
              <p className="orch-audit-task">
                Task <code>{event.taskId}</code>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function OrchestrationDashboard() {
  const [activeTab, setActiveTab] = useState('tasks')

  const [tasks, setTasks] = useState([])
  const [tasksLoading, setTasksLoading] = useState(true)
  const [tasksError, setTasksError] = useState(null)

  const [approvals, setApprovals] = useState([])
  const [approvalsLoading, setApprovalsLoading] = useState(true)
  const [approvalsError, setApprovalsError] = useState(null)

  const [orchestrationStats, setOrchestrationStats] = useState(null)

  const [auditEvents, setAuditEvents] = useState([])
  const [auditLoading, setAuditLoading] = useState(true)
  const [auditError, setAuditError] = useState(null)

  const loadTasks = useCallback(async () => {
    setTasksLoading(true)
    setTasksError(null)
    try {
      const data = await apiClient.get('/tasks')
      // API returns { tasks, page, limit, total } or array depending on implementation
      setTasks(Array.isArray(data) ? data : data.tasks || [])
    } catch (error) {
      const classified = classifyError(error)
      setTasksError({
        message: classified.userMessage || error.message,
        suggestion: classified.suggestion
      })
    } finally {
      setTasksLoading(false)
    }
  }, [])

  const loadApprovals = useCallback(async () => {
    setApprovalsLoading(true)
    setApprovalsError(null)
    try {
      const data = await apiClient.get('/approvals')
      setApprovals(Array.isArray(data) ? data : data.approvals || [])
    } catch (error) {
      const classified = classifyError(error)
      setApprovalsError({
        message: classified.userMessage || error.message,
        suggestion: classified.suggestion
      })
    } finally {
      setApprovalsLoading(false)
    }
  }, [])

  const loadAudit = useCallback(async () => {
    setAuditLoading(true)
    setAuditError(null)
    try {
      const data = await apiClient.get('/orchestration/audit')
      setAuditEvents(Array.isArray(data) ? data : data.events || [])
    } catch (error) {
      const classified = classifyError(error)
      setAuditError({
        message: classified.userMessage || error.message,
        suggestion: classified.suggestion
      })
    } finally {
      setAuditLoading(false)
    }
  }, [])

  const loadDashboardStats = useCallback(async () => {
    try {
      const data = await apiClient.get('/dashboard')
      if (data && data.orchestration) {
        setOrchestrationStats(data.orchestration)
      }
    } catch {
      // Best-effort only; dashboard already handles failures
    }
  }, [])

  useEffect(() => {
    loadTasks()
    loadApprovals()
    loadAudit()
    loadDashboardStats()

    // Lightweight polling for near real-time updates
    const intervalId = window.setInterval(() => {
      loadTasks()
      loadApprovals()
      loadDashboardStats()
    }, 8000)

    return () => window.clearInterval(intervalId)
  }, [loadTasks, loadApprovals, loadDashboardStats, loadAudit])

  return (
    <section className="orch-dashboard" aria-label="Orchestration dashboard">
      <header className="orch-header">
        <div>
          <h2>Paperclip Orchestration</h2>
          <p className="orch-subtitle">
            Tasks, approvals, agents, and budget – all from the same 4-agent pipeline that powers every diagnosis.
          </p>
        </div>
        <div className="orch-tabs" role="tablist" aria-label="Orchestration views">
          <button
            type="button"
            className={`orch-tab ${activeTab === 'tasks' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'tasks'}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
          <button
            type="button"
            className={`orch-tab ${activeTab === 'approvals' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'approvals'}
            onClick={() => setActiveTab('approvals')}
          >
            Approvals
          </button>
          <button
            type="button"
            className={`orch-tab ${activeTab === 'agents' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'agents'}
            onClick={() => setActiveTab('agents')}
          >
            Agents & Budget
          </button>
          <button
            type="button"
            className={`orch-tab ${activeTab === 'audit' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'audit'}
            onClick={() => setActiveTab('audit')}
          >
            Audit
          </button>
        </div>
      </header>

      <div className="orch-content">
        {activeTab === 'tasks' && (
          <TasksSection
            tasks={tasks}
            loading={tasksLoading}
            error={tasksError}
            onRetry={loadTasks}
          />
        )}

        {activeTab === 'approvals' && (
          <ApprovalsSection
            approvals={approvals}
            loading={approvalsLoading}
            error={approvalsError}
            onRetry={loadApprovals}
          />
        )}

        {activeTab === 'agents' && (
          <AgentsSection orchestrationStats={orchestrationStats} />
        )}

        {activeTab === 'audit' && (
          <AuditSection
            events={auditEvents}
            loading={auditLoading}
            error={auditError}
            onRetry={loadAudit}
          />
        )}
      </div>
    </section>
  )
}

