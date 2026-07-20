const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '')
const SESSION_KEY = 'personal-os-session'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    if (!session.token || (session.expiresAt && Date.parse(session.expiresAt) < Date.now())) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

export function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const session = getSession()
    if (session) headers['Authorization'] = `Bearer ${session.token}`
  }

  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Could not reach the Personal OS API.', 0)
  }

  if (res.status === 401 && auth) {
    clearSession()
    window.dispatchEvent(new Event('personal-os:unauthorized'))
  }

  if (!res.ok) {
    let message = `Request failed (${res.status}).`
    try {
      const data = await res.json()
      if (data.error) message = data.error
    } catch {
      /* keep default message */
    }
    throw new ApiError(message, res.status)
  }

  if (res.status === 204) return null
  return res.json()
}

export const api = {
  base: API_BASE,
  login: (password) => request('/api/auth/login', { method: 'POST', body: { password }, auth: false }),
  health: () => request('/api/health', { auth: false }),
  listTasks: () => request('/api/tasks'),
  createTask: (task) => request('/api/tasks', { method: 'POST', body: task }),
  updateTask: (id, patch) => request(`/api/tasks/${id}`, { method: 'PATCH', body: patch }),
  deleteTask: (id) => request(`/api/tasks/${id}`, { method: 'DELETE' }),
}
