import { formatDate, startOfWeek } from '../../lib/format.js'
import { COLUMN_LABELS } from './columns.js'

export default function TasksOverview({ tasks, loading, onOpenTask, onGoToBoard }) {
  const open = tasks.filter((t) => t.column === 'todo' || t.column === 'inprogress')
  const inProgress = tasks.filter((t) => t.column === 'inprogress')
  const weekStart = startOfWeek()
  const completedThisWeek = tasks.filter(
    (t) => t.column === 'done' && t.completedAt && new Date(t.completedAt) >= weekStart,
  )

  const recent = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8)

  return (
    <div className="tasks-overview">
      <div className="stat-row">
        <div className="stat-tile card">
          <span className="stat-value">{loading ? '–' : open.length}</span>
          <span className="stat-label">Open tasks</span>
        </div>
        <div className="stat-tile card">
          <span className="stat-value">{loading ? '–' : inProgress.length}</span>
          <span className="stat-label">In progress</span>
        </div>
        <div className="stat-tile card">
          <span className="stat-value">{loading ? '–' : completedThisWeek.length}</span>
          <span className="stat-label">Completed this week</span>
        </div>
      </div>

      <h2 className="section-title">Recent tasks</h2>
      {!loading && recent.length === 0 ? (
        <div className="empty-state">
          No tasks yet. Add your first one and it will show up here and on the board.
        </div>
      ) : (
        <div className="task-list">
          {recent.map((task) => (
            <div key={task.id} className="task-row card">
              <div className="task-row-main">
                <span className={`pill pill-${task.column}`}>{COLUMN_LABELS[task.column]}</span>
                <div className="task-row-text">
                  <span className="task-row-title">{task.title}</span>
                  <span className="task-row-meta">
                    {formatDate(task.createdAt)}
                    {task.notes ? ` · ${task.notes}` : ''}
                  </span>
                </div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => onOpenTask(task)}>
                Open
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && tasks.length > 0 && (
        <button className="btn btn-ghost board-link" onClick={onGoToBoard}>
          View the full board →
        </button>
      )}
    </div>
  )
}
