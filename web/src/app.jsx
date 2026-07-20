import { useEffect, useState } from 'react'
import Sidebar from './components/sidebar.jsx'
import PasswordGate from './components/password-gate.jsx'
import TasksModule from './modules/tasks/tasks-module.jsx'
import { MenuIcon, LogoMark } from './components/icons.jsx'
import { getSession, clearSession } from './lib/api.js'

export default function App() {
  const [authed, setAuthed] = useState(() => Boolean(getSession()))
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    const onUnauthorized = () => setAuthed(false)
    window.addEventListener('personal-os:unauthorized', onUnauthorized)
    return () => window.removeEventListener('personal-os:unauthorized', onUnauthorized)
  }, [])

  function signOut() {
    clearSession()
    setAuthed(false)
  }

  if (!authed) {
    return <PasswordGate onSuccess={() => setAuthed(true)} />
  }

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
        <TasksModule onSignOut={signOut} />
      </main>
    </div>
  )
}
