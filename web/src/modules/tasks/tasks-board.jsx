import { useState } from 'react'
import { formatDate } from '../../lib/format.js'
import { COLUMNS } from './columns.js'

export default function TasksBoard({ tasks, loading, onMove, onOpenTask, onAddTo }) {
  const [dragOver, setDragOver] = useState(null)

  function handleDrop(event, columnId) {
    event.preventDefault()
    setDragOver(null)
    const id = event.dataTransfer.getData('text/task-id')
    if (id) onMove(id, columnId)
  }

  return (
    <div className="board">
      {COLUMNS.map((column, index) => {
        const columnTasks = tasks.filter((t) => t.column === column.id)
        return (
          <section
            key={column.id}
            className={`board-column${dragOver === column.id ? ' board-column-over' : ''}`}
            onDragOver={(event) => {
              event.preventDefault()
              setDragOver(column.id)
            }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(event) => handleDrop(event, column.id)}
          >
            <header className="board-column-head">
              <span className="board-column-title">{column.label}</span>
              <span className="board-column-count">{loading ? '–' : columnTasks.length}</span>
              <button
                className="icon-btn board-add"
                onClick={() => onAddTo(column.id)}
                aria-label={`Add task to ${column.label}`}
              >
                +
              </button>
            </header>
            <div className="board-column-body">
              {columnTasks.map((task) => (
                <article
                  key={task.id}
                  className="task-card card"
                  draggable
                  onDragStart={(event) => event.dataTransfer.setData('text/task-id', task.id)}
                  onClick={() => onOpenTask(task)}
                >
                  <div className="task-card-title">{task.title}</div>
                  {task.notes && <div className="task-card-notes">{task.notes}</div>}
                  <div className="task-card-foot">
                    <div className="task-card-tags">
                      {task.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="task-card-date">{formatDate(task.createdAt)}</span>
                  </div>
                  <div className="task-card-move">
                    {index > 0 && (
                      <button
                        onClick={(event) => {
                          event.stopPropagation()
                          onMove(task.id, COLUMNS[index - 1].id)
                        }}
                        aria-label={`Move to ${COLUMNS[index - 1].label}`}
                      >
                        ← {COLUMNS[index - 1].label}
                      </button>
                    )}
                    {index < COLUMNS.length - 1 && (
                      <button
                        onClick={(event) => {
                          event.stopPropagation()
                          onMove(task.id, COLUMNS[index + 1].id)
                        }}
                        aria-label={`Move to ${COLUMNS[index + 1].label}`}
                      >
                        {COLUMNS[index + 1].label} →
                      </button>
                    )}
                  </div>
                </article>
              ))}
              {!loading && columnTasks.length === 0 && (
                <div className="board-empty">Drop tasks here</div>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
