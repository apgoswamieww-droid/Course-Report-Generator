import { NextResponse } from 'next/server'
import { checkCredentials, createToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    if (!checkCredentials(email, password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    const token = createToken()
    const res = NextResponse.json({ success: true })
    res.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
