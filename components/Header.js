'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [user, setUser] = useState(null)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.ok ? r.json() : null)
      .then(setUser)
  }, [])

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  if (pathname === '/login') return null

  async function handleLogout() {
    setLoggingOut(true)
    localStorage.removeItem('add-entry-form')
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const initials = user?.name
    ? user.name.split(' ').map((s) => s[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0]?.toUpperCase() || '?')

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-blue-700">
            Course Reports
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link
              href="/"
              className={`font-medium ${pathname === '/' ? 'text-blue-600' : 'text-zinc-600 hover:text-zinc-900'}`}
            >
              Reports
            </Link>
            <Link
              href="/custom-report"
              className={`font-medium ${pathname === '/custom-report' ? 'text-blue-600' : 'text-zinc-600 hover:text-zinc-900'}`}
            >
              Custom Report
            </Link>
            <Link
              href="/add-entry"
              className={`font-medium ${pathname === '/add-entry' ? 'text-blue-600' : 'text-zinc-600 hover:text-zinc-900'}`}
            >
              Add Entry
            </Link>
            <Link
              href="/templates"
              className={`font-medium ${pathname === '/templates' ? 'text-blue-600' : 'text-zinc-600 hover:text-zinc-900'}`}
            >
              Templates
            </Link>
          </nav>
        </div>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-zinc-100"
          >
            {user?.picture ? (
              <img src={user.picture} alt="" className="h-7 w-7 rounded-full object-cover" />
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {initials}
              </span>
            )}
            <span className="max-w-[140px] truncate text-zinc-700">
              {user?.name || user?.email || ''}
            </span>
            <svg className={`h-4 w-4 text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>

          {open && (
            <div className="absolute right-0 mt-1 w-48 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
              <div className="border-b border-zinc-100 px-3 py-2 text-xs text-zinc-500">
                {user?.email || ''}
              </div>
              <Link
                href="/profile"
                className="block px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-zinc-50 disabled:opacity-60"
              >
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
