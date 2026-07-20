import { Router } from 'express'
import { pool, taskFromRow } from '../db.js'
import { requireAuth } from '../auth.js'

export const tasksRouter = Router()

const COLUMNS = ['todo', 'inprogress', 'done']
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function validId(req, res, next) {
  if (!UUID_RE.test(req.params.id)) return res.status(404).json({ error: 'Task not found.' })
  next()
}

function parseTaskInput(body, { partial = false } = {}) {
  const errors = []
  const out = {}

  if (!partial || body.title !== undefined) {
    if (typeof body.title !== 'string' || !body.title.trim()) {
      errors.push('title is required')
    } else {
      out.title = body.title.trim()
    }
  }
  if (body.notes !== undefined) {
    if (typeof body.notes !== 'string') errors.push('notes must be a string')
    else out.notes = body.notes
  }
  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags) || body.tags.some((t) => typeof t !== 'string')) {
      errors.push('tags must be an array of strings')
    } else {
      out.tags = body.tags.map((t) => t.trim()).filter(Boolean)
    }
  }
  if (body.column !== undefined) {
    if (!COLUMNS.includes(body.column)) errors.push(`column must be one of ${COLUMNS.join(', ')}`)
    else out.column = body.column
  }

  return { out, errors }
}

tasksRouter.get('/api/tasks', requireAuth, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC')
  res.json({ tasks: rows.map(taskFromRow) })
})

tasksRouter.post('/api/tasks', requireAuth, async (req, res) => {
  const { out, errors } = parseTaskInput(req.body || {})
  if (errors.length) return res.status(400).json({ error: errors.join('; ') })

  const column = out.column || 'todo'
  const { rows } = await pool.query(
    `INSERT INTO tasks (title, notes, tags, board_column, completed_at)
     VALUES ($1, $2, $3, $4, CASE WHEN $4 = 'done' THEN now() END)
     RETURNING *`,
    [out.title, out.notes || '', out.tags || [], column],
  )
  res.status(201).json({ task: taskFromRow(rows[0]) })
})

tasksRouter.patch('/api/tasks/:id', requireAuth, validId, async (req, res) => {
  const { out, errors } = parseTaskInput(req.body || {}, { partial: true })
  if (errors.length) return res.status(400).json({ error: errors.join('; ') })
  if (Object.keys(out).length === 0) return res.status(400).json({ error: 'Nothing to update.' })

  const { rows } = await pool.query(
    `UPDATE tasks SET
       title = COALESCE($2, title),
       notes = COALESCE($3, notes),
       tags = COALESCE($4, tags),
       board_column = COALESCE($5, board_column),
       completed_at = CASE
         WHEN $5 = 'done' AND board_column <> 'done' THEN now()
         WHEN $5 IS NOT NULL AND $5 <> 'done' THEN NULL
         ELSE completed_at
       END,
       updated_at = now()
     WHERE id = $1
     RETURNING *`,
    [req.params.id, out.title ?? null, out.notes ?? null, out.tags ?? null, out.column ?? null],
  )
  if (rows.length === 0) return res.status(404).json({ error: 'Task not found.' })
  res.json({ task: taskFromRow(rows[0]) })
})

tasksRouter.delete('/api/tasks/:id', requireAuth, validId, async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id])
  if (rowCount === 0) return res.status(404).json({ error: 'Task not found.' })
  res.status(204).end()
})
