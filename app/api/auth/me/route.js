import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({
    email: process.env.AUTH_EMAIL || '',
    name: process.env.AUTH_NAME || '',
    picture: process.env.AUTH_PICTURE || '',
  })
}
