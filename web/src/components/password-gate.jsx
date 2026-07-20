import { useState } from 'react'
import { api, setSession } from '../lib/api.js'
import { LogoMark } from './icons.jsx'

export default function PasswordGate({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!password) return
    setBusy(true)
    setError(null)
    try {
      const session = await api.login(password)
      setSession(session)
      onSuccess()
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="gate">
      <form className="gate-card card" onSubmit={handleSubmit}>
        <div className="gate-head">
          <LogoMark />
          <span className="wordmark">Personal OS</span>
        </div>
        <p className="gate-text">Enter your password to open the dashboard.</p>
        {error && <div className="error-banner">{error}</div>}
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          autoFocus
          autoComplete="current-password"
        />
        <button type="submit" className="btn btn-primary gate-submit" disabled={busy || !password}>
          {busy ? 'Checking…' : 'Unlock'}
        </button>
      </form>
    </div>
  )
}
