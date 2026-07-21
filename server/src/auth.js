import crypto from 'node:crypto'

const SESSION_TTL_MS = 365 * 24 * 60 * 60 * 1000

function sessionSecret() {
  const secret = process.env.SESSION_SECRET || process.env.API_KEY
  if (!secret) throw new Error('API_KEY (or SESSION_SECRET) must be set')
  return secret
}

function b64url(buffer) {
  return Buffer.from(buffer).toString('base64url')
}

function sign(payload) {
  return b64url(crypto.createHmac('sha256', sessionSecret()).update(payload).digest())
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16)
  const hash = crypto.scryptSync(password, salt, 32)
  return `scrypt:${b64url(salt)}:${b64url(hash)}`
}

export function verifyPassword(password, stored) {
  const [scheme, saltB64, hashB64] = String(stored || '').split(':')
  if (scheme !== 'scrypt' || !saltB64 || !hashB64) return false
  const salt = Buffer.from(saltB64, 'base64url')
  const expected = Buffer.from(hashB64, 'base64url')
  const actual = crypto.scryptSync(password, salt, expected.length)
  return crypto.timingSafeEqual(actual, expected)
}

export function issueSessionToken() {
  const payload = b64url(JSON.stringify({ exp: Date.now() + SESSION_TTL_MS }))
  return { token: `${payload}.${sign(payload)}`, expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString() }
}

export function verifySessionToken(token) {
  const [payload, signature] = String(token || '').split('.')
  if (!payload || !signature) return false
  const expected = sign(payload)
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return typeof exp === 'number' && exp > Date.now()
  } catch {
    return false
  }
}

function bearerToken(req) {
  const header = req.get('authorization') || ''
  const [scheme, token] = header.split(' ')
  return scheme === 'Bearer' && token ? token : null
}

function isApiKey(token) {
  const key = process.env.API_KEY
  if (!key || !token) return false
  const a = Buffer.from(token)
  const b = Buffer.from(key)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

/* Accepts the bearer API key (programmatic writers) or a UI session token. */
export function requireAuth(req, res, next) {
  const token = bearerToken(req)
  if (isApiKey(token) || verifySessionToken(token)) return next()
  res.status(401).json({ error: 'Unauthorized.' })
}
