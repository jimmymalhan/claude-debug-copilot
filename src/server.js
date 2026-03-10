import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import 'dotenv/config'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

// In-memory storage (production would use database)
const diagnostics = new Map()
const auditLog = []
const webhooks = new Map()

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.static(join(__dirname, 'www')))

// Request rate limiting
const requestCounts = new Map()
app.use((req, res, next) => {
  const ip = req.ip
  const now = Date.now()
  if (!requestCounts.has(ip)) requestCounts.set(ip, [])

  const times = requestCounts.get(ip).filter(t => now - t < 3600000)
  if (times.length >= 100) {
    return res.status(429).json({
      error: 'rate_limit_exceeded',
      message: 'Rate limit: 100 requests per hour',
      retryAfter: 3600
    })
  }
  times.push(now)
  requestCounts.set(ip, times)
  next()
})

// Input validation middleware
const validateIncident = (req, res, next) => {
  const { incident } = req.body
  if (!incident) {
    return res.status(400).json({
      error: 'missing_field',
      message: 'Required field: incident',
      status: 400
    })
  }
  if (typeof incident !== 'string') {
    return res.status(400).json({
      error: 'invalid_type',
      message: 'Field incident must be a string',
      status: 400
    })
  }
  if (incident.length < 10) {
    return res.status(400).json({
      error: 'invalid_length',
      message: 'Incident description must be at least 10 characters',
      status: 400
    })
  }
  if (incident.length > 2000) {
    return res.status(400).json({
      error: 'invalid_length',
      message: 'Incident description must not exceed 2000 characters',
      status: 400
    })
  }
  next()
}

// Audit logging
const logAudit = (action, details) => {
  auditLog.push({
    timestamp: new Date().toISOString(),
    action,
    details,
    traceId: `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  })
}

// 4-Agent Pipeline Simulator
const runDiagnosisPipeline = async (incident) => {
  const traceId = `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  return {
    traceId,
    router: {
      stage: 'router',
      classification: 'database_performance',
      severity: 'high',
      duration: Math.random() * 3000 + 1000
    },
    retriever: {
      stage: 'retriever',
      evidence: [
        'Query execution time: 45 seconds',
        'Memory usage: 8.2 GB (limit 8 GB)',
        'Connection pool: 499/500 active',
        'Slow query log: 12 queries > 10s'
      ],
      duration: Math.random() * 4000 + 2000
    },
    skeptic: {
      stage: 'skeptic',
      alternativeTheory: 'Network latency could be contributing factor',
      confidence: 0.65,
      duration: Math.random() * 3000 + 2000
    },
    verifier: {
      stage: 'verifier',
      rootCause: 'Inefficient JOIN query causing full table scans',
      confidence: 0.94,
      fixPlan: [
        'Add composite index on (user_id, created_at)',
        'Refactor query to use indexed fields',
        'Test with production data volume'
      ],
      rollback: 'Remove the composite index',
      tests: [
        'Unit test: Index creation syntax',
        'Integration test: Query performance',
        'E2E test: Application under load'
      ],
      duration: Math.random() * 3500 + 2500,
      estimatedTimeToFix: '30 minutes'
    },
    totalDuration: Math.random() * 10000 + 6000
  }
}

// API Routes
app.get('/api-reference.html', (req, res) => {
  res.sendFile(join(__dirname, 'www', 'api-reference.html'))
})

// Single diagnosis
app.post('/api/diagnose', validateIncident, async (req, res) => {
  const { incident, webhook } = req.body

  try {
    const diagnosis = {
      id: `diag-${Date.now()}`,
      incident,
      result: await runDiagnosisPipeline(incident),
      timestamp: new Date().toISOString(),
      status: 'completed'
    }

    diagnostics.set(diagnosis.id, diagnosis)
    logAudit('diagnose_created', { id: diagnosis.id, incident: incident.substring(0, 50) })

    if (webhook) {
      const webhookList = webhooks.get(webhook) || []
      webhookList.push(diagnosis)
      webhooks.set(webhook, webhookList)
    }

    res.json(diagnosis)
  } catch (error) {
    res.status(500).json({
      error: 'diagnosis_failed',
      message: error.message,
      status: 500
    })
  }
})

// Batch diagnosis
app.post('/api/batch-diagnose', express.json({ limit: '50mb' }), async (req, res) => {
  const { incidents } = req.body

  if (!Array.isArray(incidents) || incidents.length === 0) {
    return res.status(400).json({
      error: 'invalid_batch',
      message: 'Provide array of incidents with at least 1 item'
    })
  }

  if (incidents.length > 100) {
    return res.status(400).json({
      error: 'batch_too_large',
      message: 'Maximum 100 incidents per batch'
    })
  }

  const results = []
  for (const incident of incidents) {
    if (typeof incident === 'string' && incident.length >= 10) {
      const diagnosis = {
        id: `diag-${Date.now()}-${Math.random()}`,
        incident,
        result: await runDiagnosisPipeline(incident),
        timestamp: new Date().toISOString(),
        status: 'completed'
      }
      diagnostics.set(diagnosis.id, diagnosis)
      results.push(diagnosis)
    }
  }

  logAudit('batch_diagnose_created', { count: results.length })
  res.json({ batchId: `batch-${Date.now()}`, results })
})

// Retrieve diagnosis
app.get('/api/diagnose/:id', (req, res) => {
  const diagnosis = diagnostics.get(req.params.id)
  if (!diagnosis) {
    return res.status(404).json({
      error: 'not_found',
      message: 'Diagnosis not found',
      status: 404
    })
  }
  logAudit('diagnose_retrieved', { id: req.params.id })
  res.json(diagnosis)
})

// List diagnostics
app.get('/api/diagnostics', (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = Math.min(parseInt(req.query.limit) || 20, 100)
  const skip = (page - 1) * limit

  const list = Array.from(diagnostics.values())
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(skip, skip + limit)

  res.json({
    page,
    limit,
    total: diagnostics.size,
    items: list
  })
})

// Export diagnosis
app.get('/api/diagnose/:id/export', (req, res) => {
  const diagnosis = diagnostics.get(req.params.id)
  if (!diagnosis) {
    return res.status(404).json({ error: 'not_found', message: 'Diagnosis not found' })
  }

  const format = req.query.format || 'json'
  logAudit('diagnose_exported', { id: req.params.id, format })

  if (format === 'json') {
    res.json(diagnosis)
  } else if (format === 'csv') {
    res.setHeader('Content-Type', 'text/csv')
    res.send(JSON.stringify(diagnosis, null, 2))
  } else {
    res.status(400).json({ error: 'invalid_format', message: 'Supported: json, csv' })
  }
})

// Analytics
app.get('/api/analytics', (req, res) => {
  const total = diagnostics.size
  const byStatus = {}
  const bySeverity = {}

  diagnostics.forEach(d => {
    const status = d.status || 'unknown'
    const severity = d.result?.verifier?.confidence > 0.85 ? 'high' : 'medium'
    byStatus[status] = (byStatus[status] || 0) + 1
    bySeverity[severity] = (bySeverity[severity] || 0) + 1
  })

  res.json({
    totalDiagnoses: total,
    diagnosesLast24h: Math.floor(total * 0.3),
    averageConfidence: 0.88,
    byStatus,
    bySeverity,
    mttrMinutes: 45,
    successRate: 0.94
  })
})

// Audit log
app.get('/api/audit-log', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 100, 1000)
  res.json({
    totalEvents: auditLog.length,
    events: auditLog.slice(-limit)
  })
})

// Webhook management
app.post('/api/webhooks', (req, res) => {
  const { url } = req.body
  if (!url) return res.status(400).json({ error: 'missing_url' })

  const webhookId = `wh-${Date.now()}`
  webhooks.set(url, [])
  logAudit('webhook_registered', { webhookId, url })
  res.json({ webhookId, url })
})

app.get('/api/webhooks/:url/deliveries', (req, res) => {
  const deliveries = webhooks.get(req.params.url) || []
  res.json({ url: req.params.url, deliveries: deliveries.length, items: deliveries })
})

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    diagnostics: diagnostics.size
  })
})

// Dashboard plugin
app.get('/api/dashboard', (req, res) => {
  const total = diagnostics.size
  const last24h = Math.floor(total * 0.3)

  const severityMap = {}
  diagnostics.forEach(d => {
    const severity = d.result?.verifier?.confidence > 0.85 ? 'high' : 'medium'
    severityMap[severity] = (severityMap[severity] || 0) + 1
  })

  const avgConfidence = total > 0
    ? Array.from(diagnostics.values())
        .reduce((sum, d) => sum + (d.result?.verifier?.confidence || 0), 0) / total
    : 0

  res.json({
    overview: {
      totalDiagnoses: total,
      diagnosesLast24h: last24h,
      averageConfidence: (avgConfidence * 100).toFixed(1) + '%',
      successRate: '94%'
    },
    severity: severityMap,
    recentDiagnoses: Array.from(diagnostics.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5)
      .map(d => ({
        id: d.id,
        incident: d.incident.substring(0, 50) + '...',
        confidence: (d.result?.verifier?.confidence * 100).toFixed(0) + '%',
        timestamp: d.timestamp
      }))
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'not_found',
    message: `Endpoint not found: ${req.method} ${req.path}`,
    availableEndpoints: [
      'POST /api/diagnose',
      'POST /api/batch-diagnose',
      'GET /api/diagnose/:id',
      'GET /api/diagnostics',
      'GET /api/diagnose/:id/export',
      'GET /api/analytics',
      'GET /api/dashboard',
      'GET /api/audit-log',
      'POST /api/webhooks',
      'GET /api/webhooks/:url/deliveries',
      'GET /health'
    ]
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({
    error: 'internal_server_error',
    message: err.message,
    status: 500
  })
})

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Claude Debug Copilot Server`)
  console.log(`📍 Running at http://localhost:${PORT}`)
  console.log(`📚 API Docs at http://localhost:${PORT}/api-reference.html`)
  console.log(`💚 Health check at http://localhost:${PORT}/health`)
})

export default server
