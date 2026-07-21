import { useEffect, useState } from 'react'
import Sidebar from './components/sidebar.jsx'
import PasswordGate from './components/password-gate.jsx'
import TasksModule from './modules/tasks/tasks-module.jsx'
import { MenuIcon, LogoMark } from './components/icons.jsx'
import { api, getSession, setSession, clearSession } from './lib/api.js'

function readUnlockSecret() {
  const match = window.location.hash.match(/^#unlock=(.+)$/)
  if (!match) return null
  history.replaceState(null, '', window.location.pathname + window.location.search)
  return decodeURIComponent(match[1])
}

export default function App() {
  const [authed, setAuthed] = useState(() => Boolean(getSession()))
  const [unlocking, setUnlocking] = useState(false)
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    const onUnauthorized = () => setAuthed(false)
    window.addEventListener('personal-os:unauthorized', onUnauthorized)
    return () => window.removeEventListener('personal-os:unauthorized', onUnauthorized)
  }, [])

  useEffect(() => {
    const secret = readUnlockSecret()
    if (!secret || getSession()) return
    setUnlocking(true)
    api
      .login(secret)
      .then((session) => {
        setSession(session)
        setAuthed(true)
      })
      .catch(() => {
        /* fall through to the manual gate */
      })
      .finally(() => setUnlocking(false))
  }, [])

  function signOut() {
    clearSession()
    setAuthed(false)
  }

  if (unlocking) {
    return <div className="gate">Unlocking…</div>
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
