import { useEffect, useState } from 'react'
import { api } from '../../lib/api.js'

const TAGS_KEY = 'personal-os-tags'
const DEFAULT_TAGS = ['rosie-nj', 'rosie-al', 'clean-aios', 'build']

export default function TasksSettings({ onSignOut }) {
  const [tags, setTags] = useState(
    () => (JSON.parse(localStorage.getItem(TAGS_KEY) || 'null') || DEFAULT_TAGS).join(', '),
  )
  const [saved, setSaved] = useState(false)
  const [health, setHealth] = useState('checking')

  useEffect(() => {
    let cancelled = false
    api
      .health()
      .then(() => !cancelled && setHealth('ok'))
      .catch(() => !cancelled && setHealth('down'))
    return () => {
      cancelled = true
    }
  }, [])

  function saveTags() {
    const list = tags.split(',').map((t) => t.trim()).filter(Boolean)
    localStorage.setItem(TAGS_KEY, JSON.stringify(list))
    setTags(list.join(', '))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="settings">
      <section className="card settings-card">
        <h2 className="settings-card-title">Suggested tags</h2>
        <p className="settings-card-text">
          Shown as one-tap suggestions on the task form. Comma separated.
        </p>
        <input value={tags} onChange={(event) => setTags(event.target.value)} />
        <div className="settings-card-actions">
          <button className="btn btn-primary" onClick={saveTags}>
            {saved ? 'Saved' : 'Save tags'}
          </button>
        </div>
      </section>

      <section className="card settings-card">
        <h2 className="settings-card-title">API connection</h2>
        <p className="settings-card-text">
          Tasks live in the Personal OS API and persist across devices.
        </p>
        <dl className="settings-facts">
          <div>
            <dt>API base</dt>
            <dd>{api.base || 'Same origin'}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              {health === 'checking' && 'Checking…'}
              {health === 'ok' && <span className="status-ok">Connected</span>}
              {health === 'down' && <span className="status-down">Unreachable</span>}
            </dd>
          </div>
        </dl>
      </section>

      <section className="card settings-card">
        <h2 className="settings-card-title">API key</h2>
        <p className="settings-card-text">
          Programmatic writes (Zapier, n8n, routines) authenticate with the bearer API key set as
          the <code>API_KEY</code> variable on the Railway service. To rotate it, set a new value
          there and update every writer. The key is never stored in this app.
        </p>
      </section>

      <section className="card settings-card">
        <h2 className="settings-card-title">Session</h2>
        <p className="settings-card-text">Sign out of Personal OS on this device.</p>
        <div className="settings-card-actions">
          <button className="btn btn-outline" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </section>
    </div>
  )
}
