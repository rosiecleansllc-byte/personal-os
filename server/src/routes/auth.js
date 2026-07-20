import { Router } from 'express'
import { issueSessionToken, verifyPassword } from '../auth.js'

export const authRouter = Router()

const attempts = new Map()
const WINDOW_MS = 60 * 1000
const MAX_ATTEMPTS = 10

function rateLimited(ip) {
  const now = Date.now()
  const entry = attempts.get(ip) || { count: 0, windowStart: now }
  if (now - entry.windowStart > WINDOW_MS) {
    entry.count = 0
    entry.windowStart = now
  }
  entry.count += 1
  attempts.set(ip, entry)
  return entry.count > MAX_ATTEMPTS
}

authRouter.post('/api/auth/login', (req, res) => {
  if (rateLimited(req.ip)) {
    return res.status(429).json({ error: 'Too many attempts. Try again in a minute.' })
  }
  const { password } = req.body || {}
  if (typeof password !== 'string' || !verifyPassword(password, process.env.UI_PASSWORD_HASH)) {
    return res.status(401).json({ error: 'Wrong password.' })
  }
  res.json(issueSessionToken())
})
