import { useState } from 'react'
import Sidebar from './components/sidebar.jsx'
import TasksModule from './modules/tasks/tasks-module.jsx'
import { MenuIcon, LogoMark } from './components/icons.jsx'

export default function App() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="shell">
      <header className="topbar">
        <button className="icon-btn" onClick={() => setNavOpen(true)} aria-label="Open navigation">
          <MenuIcon />
        </button>
        <LogoMark />
        <span className="wordmark">Personal OS</span>
      </header>

      <Sidebar active="tasks" open={navOpen} onClose={() => setNavOpen(false)} />
      {navOpen && <div className="backdrop" onClick={() => setNavOpen(false)} />}

      <main className="main">
        <TasksModule />
      </main>
    </div>
  )
}
