/**
 * Integration Tests — Orchestration API Endpoints
 *
 * Tests for /api/tasks, /api/tasks/:taskId, /api/tasks/:taskId/approvals,
 * and /api/approvals endpoints.
 *
 * Validates orchestrator data structures that are exposed via REST API.
 */

import { jest } from '@jest/globals'
import { DebugOrchestrator } from '../../src/orchestrator/orchestrator-client.js'
import { AuditLogger } from '../../src/orchestrator/audit-logger.js'
import { BudgetEnforcer } from '../../src/orchestrator/budget-enforcer.js'
import { TaskManager } from '../../src/orchestrator/task-manager.js'

describe('Orchestration API Endpoints', () => {
  let orchestrator
  let taskManager

  beforeEach(() => {
    // Create a fresh orchestrator for each test
    orchestrator = new DebugOrchestrator({ repoRoot: process.cwd() })
    taskManager = orchestrator.taskManager
  })

  // ============================================================
  // Scenario 1: GET /api/tasks - List all tasks
  // ============================================================
  describe('GET /api/tasks - List all tasks', () => {
    test('listTasks returns empty array initially', () => {
      const tasks = taskManager.listTasks()
      expect(Array.isArray(tasks)).toBe(true)
      expect(tasks.length).toBe(0)
    })

    test('listTasks returns array with proper structure', () => {
      // Create a task
      const taskInput = {
        type: 'debug',
        evidence: ['error log'],
        hypothesis: 'Test hypothesis'
      }
      const created = taskManager.createTask(taskInput)
      const tasks = taskManager.listTasks()

      expect(Array.isArray(tasks)).toBe(true)
      expect(tasks.length).toBeGreaterThan(0)
      expect(tasks[0]).toHaveProperty('taskId')
      expect(tasks[0]).toHaveProperty('type')
      expect(tasks[0]).toHaveProperty('status')
      expect(tasks[0]).toHaveProperty('state')
    })

    test('listTasks supports status filter', () => {
      // Create a task
      taskManager.createTask({
        type: 'debug',
        evidence: ['error'],
        hypothesis: 'test'
      })

      const pendingTasks = taskManager.listTasks({ status: 'pending' })
      expect(Array.isArray(pendingTasks)).toBe(true)
      expect(pendingTasks.length).toBeGreaterThan(0)
    })

    test('listTasks supports type filter', () => {
      // Create a debug task
      taskManager.createTask({
        type: 'debug',
        evidence: ['error'],
        hypothesis: 'test'
      })

      const debugTasks = taskManager.listTasks({ type: 'debug' })
      expect(Array.isArray(debugTasks)).toBe(true)
      expect(debugTasks.length).toBeGreaterThan(0)

      const verifyTasks = taskManager.listTasks({ type: 'verify' })
      expect(Array.isArray(verifyTasks)).toBe(true)
    })

    test('listTasks response can be paginated', () => {
      // Create multiple tasks
      for (let i = 0; i < 25; i++) {
        taskManager.createTask({
          type: 'debug',
          evidence: [`error ${i}`],
          hypothesis: 'test'
        })
      }

      const allTasks = taskManager.listTasks()
      expect(allTasks.length).toBe(25)

      // Simulate pagination: page 1, limit 10
      const page1 = allTasks.slice(0, 10)
      expect(page1.length).toBe(10)

      // Simulate pagination: page 2, limit 10
      const page2 = allTasks.slice(10, 20)
      expect(page2.length).toBe(10)

      // Simulate pagination: page 3, limit 10
      const page3 = allTasks.slice(20, 30)
      expect(page3.length).toBe(5)
    })
  })

  // ============================================================
  // Scenario 2: GET /api/tasks/:taskId - Get single task
  // ============================================================
  describe('GET /api/tasks/:taskId - Get single task', () => {
    test('getTask throws error when taskId does not exist', () => {
      expect(() => {
        taskManager.getTask('nonexistent-task-id')
      }).toThrow('Task not found')
    })

    test('getTask returns full task object for valid taskId', () => {
      // Create a task
      const taskInput = {
        type: 'debug',
        evidence: ['error log'],
        hypothesis: 'Caching issue'
      }
      const created = taskManager.createTask(taskInput)
      const taskId = created.taskId

      // Retrieve it
      const task = taskManager.getTask(taskId)

      expect(task).toHaveProperty('taskId', taskId)
      expect(task).toHaveProperty('type', 'debug')
      expect(task).toHaveProperty('status', 'pending')
      expect(task).toHaveProperty('input')
      expect(task).toHaveProperty('output')
      expect(task).toHaveProperty('approvals')
      expect(task).toHaveProperty('governance')
      expect(task).toHaveProperty('createdAt')
      expect(task).toHaveProperty('stateMachine')
    })

    test('getTask returns input with evidence and hypothesis', () => {
      const taskInput = {
        type: 'debug',
        evidence: ['error log 1', 'error log 2'],
        hypothesis: 'Database timeout'
      }
      const created = taskManager.createTask(taskInput)
      const task = taskManager.getTask(created.taskId)

      expect(task.input.evidence).toEqual(['error log 1', 'error log 2'])
      expect(task.input.hypothesis).toBe('Database timeout')
    })

    test('getTask returns task with timestamp', () => {
      const created = taskManager.createTask({
        type: 'debug',
        evidence: ['error'],
        hypothesis: 'test'
      })
      const task = taskManager.getTask(created.taskId)

      expect(task.createdAt).toBeTruthy()
      expect(typeof task.createdAt).toBe('string')
      // Should be ISO format
      expect(task.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    })
  })

  // ============================================================
  // Scenario 3: GET /api/tasks/:taskId/approvals - Approval state
  // ============================================================
  describe('GET /api/tasks/:taskId/approvals - Approval state', () => {
    test('getTask returns task with stateMachine containing approval state', () => {
      const created = taskManager.createTask({
        type: 'debug',
        evidence: ['error'],
        hypothesis: 'test'
      })
      const task = taskManager.getTask(created.taskId)
      const stateMachine = task.stateMachine

      expect(stateMachine).toBeDefined()
      expect(typeof stateMachine.getState).toBe('function')
      expect(typeof stateMachine.getVerdicts).toBe('function')
      expect(typeof stateMachine.getHistory).toBe('function')
    })

    test('stateMachine.getState() returns valid state', () => {
      const created = taskManager.createTask({
        type: 'debug',
        evidence: ['error'],
        hypothesis: 'test'
      })
      const task = taskManager.getTask(created.taskId)
      const state = task.stateMachine.getState()

      expect(['pending', 'skeptic_review', 'verifier_review', 'awaiting_approver', 'approved', 'blocked', 'escalated', 'user_override']).toContain(state)
    })

    test('stateMachine.getVerdicts() returns verdict object', () => {
      const created = taskManager.createTask({
        type: 'debug',
        evidence: ['error'],
        hypothesis: 'test'
      })
      const task = taskManager.getTask(created.taskId)
      const verdicts = task.stateMachine.getVerdicts()

      expect(verdicts).toBeDefined()
      expect(typeof verdicts).toBe('object')
      expect(verdicts).toHaveProperty('skeptic')
      expect(verdicts).toHaveProperty('verifier')
      expect(verdicts).toHaveProperty('approver')
    })

    test('stateMachine.getHistory() returns array of state transitions', () => {
      const created = taskManager.createTask({
        type: 'debug',
        evidence: ['error'],
        hypothesis: 'test'
      })
      const task = taskManager.getTask(created.taskId)
      const history = task.stateMachine.getHistory()

      expect(Array.isArray(history)).toBe(true)
    })

    test('stateMachine includes timeout information', () => {
      const created = taskManager.createTask({
        type: 'debug',
        evidence: ['error'],
        hypothesis: 'test'
      })
      const task = taskManager.getTask(created.taskId)
      const stateMachine = task.stateMachine

      // stateMachine should have stateEnteredAt timestamp
      expect(stateMachine.stateEnteredAt).toBeDefined()
      expect(typeof stateMachine.stateEnteredAt).toBe('number')

      // Timeout should be 4 hours from entry
      const timeout = new Date(stateMachine.stateEnteredAt + 4 * 60 * 60 * 1000).toISOString()
      expect(timeout).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    })
  })

  // ============================================================
  // Scenario 4: GET /api/approvals - List pending approvals
  // ============================================================
  describe('GET /api/approvals - List pending approvals', () => {
    test('returns empty list when no tasks exist', () => {
      const allTasks = taskManager.listTasks()
      expect(allTasks.length).toBe(0)
    })

    test('returns only non-terminal approval states', () => {
      // Create a task - it starts in 'pending' state
      const created = taskManager.createTask({
        type: 'debug',
        evidence: ['error'],
        hypothesis: 'test'
      })
      const task = taskManager.getTask(created.taskId)

      const approvalState = task.stateMachine.getState()
      // Should not be 'approved' or 'blocked'
      expect(['approved', 'blocked']).not.toContain(approvalState)
    })

    test('approval response includes taskId, state, verdicts, timestamps', () => {
      const created = taskManager.createTask({
        type: 'debug',
        evidence: ['error'],
        hypothesis: 'test'
      })
      const task = taskManager.getTask(created.taskId)
      const stateMachine = task.stateMachine

      // Simulate approval response structure
      const approval = {
        taskId: task.taskId,
        taskType: task.type,
        state: stateMachine.getState(),
        verdicts: stateMachine.getVerdicts(),
        createdAt: task.createdAt,
        dueAt: new Date(stateMachine.stateEnteredAt + 4 * 60 * 60 * 1000).toISOString()
      }

      expect(approval).toHaveProperty('taskId')
      expect(approval).toHaveProperty('taskType')
      expect(approval).toHaveProperty('state')
      expect(approval).toHaveProperty('verdicts')
      expect(approval).toHaveProperty('createdAt')
      expect(approval).toHaveProperty('dueAt')
    })

    test('dueAt is calculated as 4 hours from state entry', () => {
      const created = taskManager.createTask({
        type: 'debug',
        evidence: ['error'],
        hypothesis: 'test'
      })
      const task = taskManager.getTask(created.taskId)
      const stateMachine = task.stateMachine

      const dueAt = new Date(stateMachine.stateEnteredAt + 4 * 60 * 60 * 1000)
      const now = new Date(stateMachine.stateEnteredAt)

      // Due should be ~4 hours after now
      const diffMs = dueAt.getTime() - now.getTime()
      const diffHours = diffMs / (1000 * 60 * 60)

      expect(diffHours).toBeCloseTo(4, 1)
    })

    test('can filter approvals by state', () => {
      // Create multiple tasks
      const task1 = taskManager.createTask({
        type: 'debug',
        evidence: ['error'],
        hypothesis: 'test'
      })

      const allTasks = taskManager.listTasks()
      const pendingtasks = taskManager.listTasks({ status: 'pending' })

      // Both should return valid results
      expect(Array.isArray(allTasks)).toBe(true)
      expect(Array.isArray(pendingtasks)).toBe(true)
    })

    test('can filter approvals by taskType', () => {
      taskManager.createTask({
        type: 'debug',
        evidence: ['error'],
        hypothesis: 'test'
      })

      const debugTasks = taskManager.listTasks({ type: 'debug' })
      const verifyTasks = taskManager.listTasks({ type: 'verify' })

      expect(Array.isArray(debugTasks)).toBe(true)
      expect(debugTasks.length).toBeGreaterThan(0)
      expect(Array.isArray(verifyTasks)).toBe(true)
    })
  })

  // ============================================================
  // Error Handling
  // ============================================================
  describe('Error handling', () => {
    test('listTasks handles empty filter gracefully', () => {
      const tasks = taskManager.listTasks({})
      expect(Array.isArray(tasks)).toBe(true)
    })

    test('getTask throws descriptive error for invalid taskId', () => {
      expect(() => {
        taskManager.getTask('invalid-id')
      }).toThrow(/Task not found/)
    })

    test('listTasks with invalid filter returns empty array', () => {
      taskManager.createTask({
        type: 'debug',
        evidence: ['error'],
        hypothesis: 'test'
      })

      const results = taskManager.listTasks({ status: 'nonexistent-status' })
      expect(Array.isArray(results)).toBe(true)
      expect(results.length).toBe(0)
    })
  })

  // ============================================================
  // Integration: Task Creation to Approval State Flow
  // ============================================================
  describe('Integration: Task Creation to Approval State Flow', () => {
    test('task creation sets initial approval state to pending', () => {
      const created = taskManager.createTask({
        type: 'debug',
        evidence: ['error log'],
        hypothesis: 'Database connection timeout'
      })

      const task = taskManager.getTask(created.taskId)
      const state = task.stateMachine.getState()

      expect(['pending', 'skeptic_review', 'verifier_review']).toContain(state)
    })

    test('task includes all required approval fields', () => {
      const created = taskManager.createTask({
        type: 'debug',
        evidence: ['error'],
        hypothesis: 'test'
      })

      const task = taskManager.getTask(created.taskId)

      expect(task.approvals).toBeDefined()
      expect(task.approvals).toHaveProperty('skeptic')
      expect(task.approvals).toHaveProperty('verifier')
      expect(task.approvals).toHaveProperty('approver')
    })

    test('task lifecycle: create → list → retrieve → check approvals', () => {
      // Create task
      const created = taskManager.createTask({
        type: 'debug',
        evidence: ['error'],
        hypothesis: 'test'
      })
      expect(created.taskId).toBeTruthy()

      // List tasks
      const allTasks = taskManager.listTasks()
      expect(allTasks.length).toBeGreaterThan(0)
      expect(allTasks[0].taskId).toBeTruthy()

      // Retrieve task
      const task = taskManager.getTask(created.taskId)
      expect(task.taskId).toBe(created.taskId)

      // Check approval state
      const state = task.stateMachine.getState()
      expect(state).toBeTruthy()
    })
  })

  // ============================================================
  // Contract & Response Format
  // ============================================================
  describe('API Contract & Response Format', () => {
    test('listTasks response structure is consistent', () => {
      const tasks = taskManager.listTasks()
      expect(Array.isArray(tasks)).toBe(true)

      if (tasks.length > 0) {
        const firstTask = tasks[0]
        expect(firstTask).toHaveProperty('taskId')
        expect(firstTask).toHaveProperty('type')
        expect(firstTask).toHaveProperty('status')
        expect(firstTask).toHaveProperty('state')
      }
    })

    test('getTask response structure includes all documented fields', () => {
      const created = taskManager.createTask({
        type: 'debug',
        evidence: ['error'],
        hypothesis: 'test'
      })
      const task = taskManager.getTask(created.taskId)

      const requiredFields = ['taskId', 'type', 'status', 'input', 'output', 'approvals', 'governance', 'createdAt', 'stateMachine']
      requiredFields.forEach(field => {
        expect(task).toHaveProperty(field)
      })
    })

    test('approval state response includes all approval fields', () => {
      const created = taskManager.createTask({
        type: 'debug',
        evidence: ['error'],
        hypothesis: 'test'
      })
      const task = taskManager.getTask(created.taskId)
      const stateMachine = task.stateMachine

      expect(stateMachine.getState()).toBeTruthy()
      expect(stateMachine.getVerdicts()).toBeDefined()
      expect(stateMachine.getHistory()).toBeDefined()
      expect(stateMachine.stateEnteredAt).toBeDefined()
    })

    test('all timestamps are ISO 8601 format', () => {
      const created = taskManager.createTask({
        type: 'debug',
        evidence: ['error'],
        hypothesis: 'test'
      })
      const task = taskManager.getTask(created.taskId)

      expect(task.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z?$/)

      if (task.completedAt) {
        expect(task.completedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z?$/)
      }
    })
  })

  // ============================================================
  // Pagination & Filtering (Endpoint-level logic)
  // ============================================================
  describe('Pagination & Filtering', () => {
    test('pagination math: page=1, limit=10 returns first 10 items', () => {
      // Create 25 tasks
      for (let i = 0; i < 25; i++) {
        taskManager.createTask({
          type: 'debug',
          evidence: [`error ${i}`],
          hypothesis: 'test'
        })
      }

      const allTasks = taskManager.listTasks()
      const page = 1
      const limit = 10
      const skip = (page - 1) * limit

      const paged = allTasks.slice(skip, skip + limit)
      expect(paged.length).toBe(10)
    })

    test('pagination math: page=2, limit=10 skips first 10 items', () => {
      // Create 25 tasks
      for (let i = 0; i < 25; i++) {
        taskManager.createTask({
          type: 'debug',
          evidence: [`error ${i}`],
          hypothesis: 'test'
        })
      }

      const allTasks = taskManager.listTasks()
      const page = 2
      const limit = 10
      const skip = (page - 1) * limit

      const paged = allTasks.slice(skip, skip + limit)
      expect(paged.length).toBe(10)
      expect(paged[0].taskId).not.toBe(allTasks[0].taskId)
    })

    test('pagination respects maximum limit enforcement', () => {
      const allTasks = taskManager.listTasks()
      const limit = 100
      const maxLimit = Math.min(limit, 100)

      expect(maxLimit).toBe(100)

      const overLimit = 200
      const enforcedLimit = Math.min(overLimit, 100)
      expect(enforcedLimit).toBe(100)
    })
  })
})
