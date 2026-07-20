import { useState } from 'react'
import ModuleHeader from '../../components/module-header.jsx'
import { PlusIcon } from '../../components/icons.jsx'
import { useTasks } from '../../lib/use-tasks.js'
import TasksOverview from './tasks-overview.jsx'
import TasksBoard from './tasks-board.jsx'
import TasksSettings from './tasks-settings.jsx'
import TaskForm from './task-form.jsx'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'board', label: 'Board' },
  { id: 'settings', label: 'Settings' },
]

export default function TasksModule({ onSignOut }) {
  const [tab, setTab] = useState('overview')
  const { tasks, loading, error, refresh, createTask, updateTask, removeTask } = useTasks()
  const [dialog, setDialog] = useState(null)
  const [actionError, setActionError] = useState(null)

  function openNew(column = 'todo') {
    setDialog({ mode: 'new', column })
  }

  function openTask(task) {
    setDialog({ mode: 'edit', task })
  }

  async function moveTask(id, column) {
    setActionError(null)
    try {
      await updateTask(id, { column })
    } catch (err) {
      setActionError(err.message)
    }
  }

  return (
    <div className="module">
      <ModuleHeader
        title="Tasks"
        subtitle="One board for business and build work, from any device."
        tabs={TABS}
        activeTab={tab}
        onTabChange={setTab}
        actions={
          tab !== 'settings' && (
            <>
              <button className="btn btn-outline" onClick={refresh} disabled={loading}>
                {loading ? 'Refreshing…' : 'Refresh'}
              </button>
              <button className="btn btn-primary" onClick={() => openNew()}>
                <PlusIcon width={15} height={15} /> New task
              </button>
            </>
          )
        }
      />

      <div className="module-body">
        {(error || actionError) && <div className="error-banner">{error || actionError}</div>}

        {tab === 'overview' && (
          <TasksOverview
            tasks={tasks}
            loading={loading}
            onOpenTask={openTask}
            onGoToBoard={() => setTab('board')}
          />
        )}
        {tab === 'board' && (
          <TasksBoard
            tasks={tasks}
            loading={loading}
            onMove={moveTask}
            onOpenTask={openTask}
            onAddTo={openNew}
          />
        )}
        {tab === 'settings' && <TasksSettings onSignOut={onSignOut} />}
      </div>

      {dialog && (
        <TaskForm
          task={dialog.mode === 'edit' ? dialog.task : null}
          defaultColumn={dialog.column || 'todo'}
          onSave={(input) =>
            dialog.mode === 'edit' ? updateTask(dialog.task.id, input) : createTask(input)
          }
          onDelete={dialog.mode === 'edit' ? removeTask : undefined}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  )
}
