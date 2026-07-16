'use client'

import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.ok ? r.json() : null)
      .then(setUser)
  }, [])

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-zinc-800">Profile</h1>
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-4">
          {user?.picture ? (
            <img src={user.picture} alt="" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
              {user?.name
                ? user.name.split(' ').map((s) => s[0]).join('').toUpperCase().slice(0, 2)
                : user?.email?.[0]?.toUpperCase() || '?'}
            </span>
          )}
          <div>
            <p className="text-lg font-semibold text-zinc-800">{user?.name || 'Not set'}</p>
            <p className="text-sm text-zinc-500">{user?.email || ''}</p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-zinc-100 pb-2">
            <span className="text-zinc-500">Email</span>
            <span className="text-zinc-800">{user?.email || '—'}</span>
          </div>
          <div className="flex justify-between border-b border-zinc-100 pb-2">
            <span className="text-zinc-500">Name</span>
            <span className="text-zinc-800">{user?.name || '—'}</span>
          </div>
          <div className="flex justify-between pb-2">
            <span className="text-zinc-500">Profile Picture</span>
            <span className="text-zinc-800">{user?.picture || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
