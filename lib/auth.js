import { cookies } from 'next/headers'
import crypto from 'crypto'

const TOKEN_KEY = 'auth_token'

function sign(data) {
  const hmac = crypto.createHmac('sha256', process.env.AUTH_PASSWORD || 'fallback_secret')
  hmac.update(data)
  return hmac.digest('hex')
}

export function createToken() {
  const payload = JSON.stringify({ email: process.env.AUTH_EMAIL, ts: Date.now() })
  const encoded = Buffer.from(payload).toString('base64')
  const sig = sign(encoded)
  return `${encoded}.${sig}`
}

function verify(token) {
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [encoded, sig] = parts
  const expected = sign(encoded)
  if (sig !== expected) return false
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64').toString())
    return payload.email === process.env.AUTH_EMAIL
  } catch { return false }
}

export async function isAuthenticated() {
  const c = await cookies()
  const token = c.get(TOKEN_KEY)?.value
  if (!token) return false
  return verify(token)
}

export function checkCredentials(email, password) {
  return email === process.env.AUTH_EMAIL && password === process.env.AUTH_PASSWORD
}
