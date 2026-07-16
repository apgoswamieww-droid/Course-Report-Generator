import { NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/api/auth/login']
const STATIC_ASSETS = /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/

export function middleware(request) {
  const { pathname } = request.nextUrl

  if (STATIC_ASSETS.test(pathname)) return NextResponse.next()
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) return NextResponse.next()

  const token = request.cookies.get('auth_token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
