import { useState } from 'react'
import { COLUMNS } from './columns.js'

const DEFAULT_TAGS = ['rosie-nj', 'rosie-al', 'clean-aios', 'build']

export default function TaskForm({ task, defaultColumn = 'todo', onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(task?.title || '')
  const [notes, setNotes] = useState(task?.notes || '')
  const [tags, setTags] = useState(task?.tags?.join(', ') || '')
  const [column, setColumn] = useState(task?.column || defaultColumn)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const suggestedTags = JSON.parse(localStorage.getItem('personal-os-tags') || 'null') || DEFAULT_TAGS

  function toggleTag(tag) {
    const current = tags.split(',').map((t) => t.trim()).filter(Boolean)
    const next = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]
    setTags(next.join(', '))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    setError(null)
    try {
      await onSave({
        title: title.trim(),
        notes: notes.trim(),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        column,
      })
      onClose()
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  async function handleDelete() {
    setSaving(true)
    setError(null)
    try {
      await onDelete(task.id)
      onClose()
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog card" onClick={(event) => event.stopPropagation()}>
        <h2 className="dialog-title">{task ? 'Edit task' : 'New task'}</h2>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={handleSubmit} className="dialog-form">
          <label className="field">
            <span className="field-label">Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What needs doing?"
              autoFocus
              required
            />
          </label>
          <label className="field">
            <span className="field-label">Notes</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional details"
              rows={3}
            />
          </label>
          <label className="field">
            <span className="field-label">Tags</span>
            <input
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="Comma separated, e.g. rosie-nj, build"
            />
          </label>
          <div className="tag-suggestions">
            {suggestedTags.map((tag) => (
              <button type="button" key={tag} className="tag tag-clickable" onClick={() => toggleTag(tag)}>
                {tag}
              </button>
            ))}
          </div>
          <label className="field">
            <span className="field-label">Column</span>
            <select value={column} onChange={(event) => setColumn(event.target.value)}>
              {COLUMNS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <div className="dialog-actions">
            {task && onDelete && (
              <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={saving}>
                Delete
              </button>
            )}
            <span className="dialog-actions-spacer" />
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving || !title.trim()}>
              {saving ? 'Saving…' : task ? 'Save changes' : 'Add task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
