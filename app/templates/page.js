'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(null)

  useEffect(() => {
    fetch('/api/template')
      .then((r) => r.json())
      .then((d) => setTemplates(d.templates || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleGenerate(t) {
    setGenerating(t._id)
    try {
      const res = await fetch('/api/template/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: t._id }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        return alert(err.error || 'Failed to generate')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${t.name.replace(/\s+/g, '_')}.docx`
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      alert('Failed to generate report')
    } finally {
      setGenerating(null)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this template?')) return
    try {
      await fetch(`/api/template?id=${id}`, { method: 'DELETE' })
      setTemplates((prev) => prev.filter((t) => t._id !== id))
    } catch {
      alert('Failed to delete')
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-800">Report Templates</h1>
        <Link
          href="/custom-report"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + New Template
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Loading...</p>
      ) : templates.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-zinc-200 p-12 text-center">
          <p className="text-zinc-500">No templates yet.</p>
          <Link href="/custom-report" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
            Create one in Form Designer
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {templates.map((t) => (
            <div
              key={t._id}
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm"
            >
              <div>
                <h3 className="font-semibold text-zinc-800">{t.name}</h3>
                <p className="text-xs text-zinc-500">
                  {t.fields?.length || 0} field(s) &middot; {t.title}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/custom-report"
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                >
                  Edit in Designer
                </Link>
                <button
                  onClick={() => handleGenerate(t)}
                  disabled={generating === t._id}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {generating === t._id ? 'Generating...' : 'Generate Word'}
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
