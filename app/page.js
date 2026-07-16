'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import * as XLSX from 'xlsx'

const PER_PAGE_OPTIONS = [5, 10, 25, 50]

function Toast() {
  const searchParams = useSearchParams()
  const [toast, setToast] = useState('')
  const timer = useRef(null)

  useEffect(() => {
    const msg = searchParams.get('success')
    if (msg) {
      setToast(decodeURIComponent(msg))
      const url = new URL(window.location)
      url.searchParams.delete('success')
      window.history.replaceState({}, '', url)
    }
  }, [searchParams])

  useEffect(() => {
    if (toast) {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setToast(''), 4000)
    }
  }, [toast])

  if (!toast) return null
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white shadow-lg">
      {toast}
    </div>
  )
}

export default function Home() {
  const [reports, setReports] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [rankFilter, setRankFilter] = useState('')
  const [gradingFilter, setGradingFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [generatingPdf, setGeneratingPdf] = useState(false)

  const fetchReports = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, perPage, search, course: courseFilter, rank: rankFilter, grading: gradingFilter })
      const res = await fetch(`/api/report?${params}`)
      const data = await res.json()
      if (res.ok) {
        setReports(data.reports)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      }
    } finally {
      setLoading(false)
    }
  }, [page, perPage, search, courseFilter, rankFilter, gradingFilter])

  useEffect(() => { fetchReports() }, [fetchReports])

  async function confirmDelete() {
    if (!deleteTarget) return
    const res = await fetch(`/api/report?id=${deleteTarget}`, { method: 'DELETE' })
    setDeleteTarget(null)
    if (res.ok) fetchReports()
  }

  async function handleGenerateSingle(report) {
    const fd = new FormData()
    for (const [key, val] of Object.entries(report)) {
      if (val === null || val === undefined) continue
      if (typeof val === 'object') {
        fd.append(key, JSON.stringify(val))
      } else {
        fd.append(key, String(val))
      }
    }
    const res = await fetch('/api/report', { method: 'POST', body: fd })
    if (!res.ok) return alert('Failed to generate report')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Report_${report.icNo || 'draft'}.docx`
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  async function handleGenerateDocx() {
    setShowGenerateModal(false)
    setGenerating(true)
    try {
      const res = await fetch('/api/report/generate-all', { method: 'POST' })
      if (!res.ok) return alert('No reports to generate')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'All_Reports.docx'
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      setGenerating(false)
    }
  }

  async function handleGeneratePdf() {
    setShowGenerateModal(false)
    setGeneratingPdf(true)
    try {
      const res = await fetch('/api/report/generate-all-pdf', { method: 'POST' })
      if (!res.ok) return alert('No reports to generate')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'All_Reports.pdf'
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      setGeneratingPdf(false)
    }
  }

  function handleGenerateWeb() {
    setShowGenerateModal(false)
    window.open('/reports-print', '_blank')
  }

  const EXPORT_FIELDS = [
    { key: 'courseName', label: 'Course Name' },
    { key: 'serialNo', label: 'Serial No' },
    { key: 'fromDate', label: 'From Date' },
    { key: 'toDate', label: 'To Date' },
    { key: 'icNo', label: 'IC No' },
    { key: 'rank', label: 'Rank' },
    { key: 'name', label: 'Name' },
    { key: 'unit', label: 'Unit' },
    { key: 'corps', label: 'Corps' },
    { key: 'formation', label: 'Formation' },
    { key: 'command', label: 'Command' },
    { key: 'apptCmpUnit', label: 'Appt (Cmp Unit)' },
    { key: 'regtCrops', label: 'Regt / Corps' },
    { key: 'dateOfCommission', label: 'Date of Commission' },
    { key: 'dateOfSeniority', label: 'Date of Seniority' },
    { key: 'dateOfSubRanks', label: 'Date of Sub Ranks' },
    { key: 'dateOfSuperannuation', label: 'Date of Superannuation' },
    { key: 'concernedMS', label: 'Concerned MS' },
    { key: 'dateOfBirth', label: 'Date of Birth' },
    { key: 'age', label: 'Age' },
    { key: 'dateOfMarriage', label: 'Date of Marriage' },
    { key: 'dateOfTOS', label: 'Date of TOS' },
    { key: 'dateOfTORS', label: 'Date of TORS' },
    { key: 'tenureCMP', label: 'Tenure at CMP' },
    { key: 'arrivalDateCCW', label: 'Arrival Date CCW' },
    { key: 'height', label: 'Height (CM)' },
    { key: 'weight', label: 'Weight (KG)' },
    { key: 'bmi', label: 'BMI' },
    { key: 'medicalCategory', label: 'Medical Category' },
    { key: 'diagnosis', label: 'Diagnosis' },
    { key: 'iCardNo', label: 'I-Card No' },
    { key: 'warrantCardNo', label: 'Warrant Card No' },
    { key: 'panCardNo', label: 'PAN Card No' },
    { key: 'aadhaarCardNo', label: 'Aadhaar Card No' },
    { key: 'passportNo', label: 'Passport No' },
    { key: 'cdaAcctNo', label: 'CDA Acct No' },
    { key: 'mobNo', label: 'Mob No' },
    { key: 'emailId', label: 'Email ID' },
    { key: 'religion', label: 'Religion' },
    { key: 'bloodGroup', label: 'Blood Group' },
    { key: 'basicPay', label: 'Basic Pay' },
    { key: 'foodPreference', label: 'Food Preference' },
    { key: 'admInfo', label: 'Adm Info' },
    { key: 'movementOrder', label: 'Movement Order' },
    { key: 'lrc', label: 'LRC' },
    { key: 'willingnessCert', label: 'Willingness Cert' },
    { key: 'medicalCert', label: 'Medical Cert' },
    { key: 'nominalRoll', label: 'Nominal Roll' },
    { key: 'etg', label: 'ETG' },
    { key: 'cyberSecurityCert', label: 'Cyber Security Cert' },
    { key: 'appxFAO', label: 'Appx FAO' },
    { key: 'teiFeedback', label: 'TEI Feedback' },
    { key: 'teiFeedbackPoints', label: 'TEI Feedback Points' },
    { key: 'admFeedback', label: 'Adm Feedback' },
    { key: 'admFeedbackPoints', label: 'Adm Feedback Points' },
    { key: 'mutualAssessment', label: 'Mutual Assessment' },
    { key: 'withFamily', label: 'With Family' },
    { key: 'departureDate', label: 'Departure Date' },
    { key: 'dateOfSORS', label: 'Date of SORS' },
    { key: 'jainUniversitySerNo', label: 'Jain University Ser No' },
    { key: 'entrance', label: 'Entrance' },
    { key: 'lawEnforcementTheory', label: 'Law Enforcement Theory' },
    { key: 'trafficManagementTheory', label: 'Traffic Management Theory' },
    { key: 'investigationTheory', label: 'Investigation Theory' },
    { key: 'lawTheory', label: 'Law Theory' },
    { key: 'totalTheory', label: 'Total Theory' },
    { key: 'theoryPercentage', label: 'Theory %' },
    { key: 'exAnushashan', label: 'Ex-Anushashan' },
    { key: 'exKabu', label: 'Ex-Kabu' },
    { key: 'exNandi', label: 'Ex-Nandi' },
    { key: 'exMaruVijay', label: 'Ex-Maru Vijay' },
    { key: 'exKhoj', label: 'Ex-Khoj' },
    { key: 'caseStudyTrg', label: 'Case Study Trg' },
    { key: 'misc20', label: 'Misc 20' },
    { key: 'militaryPaperTrg', label: 'Military Paper Trg' },
    { key: 'totalTrgEx', label: 'Total Trg Ex' },
    { key: 'trgExPercentage', label: 'Trg Ex %' },
    { key: 'dsII', label: 'DS II' },
    { key: 'dsI', label: 'DS I' },
    { key: 'ocCCW', label: 'OC CCW' },
    { key: 'dcci', label: 'DCCI' },
    { key: 'commandant', label: 'Commandant' },
    { key: 'totalDS', label: 'Total DS' },
    { key: 'dsPercentage', label: 'DS %' },
    { key: 'totalOverall', label: 'Total Overall' },
    { key: 'overallPercentage', label: 'Overall %' },
    { key: 'knowledge', label: 'Knowledge' },
    { key: 'application', label: 'Application' },
    { key: 'penPicture', label: 'Pen Picture' },
    { key: 'courseSymbol', label: 'Course Symbol' },
    { key: 'instructionalAbility', label: 'Instructional Ability' },
    { key: 'orderOfMerit', label: 'Order of Merit' },
    { key: 'totalOfficers', label: 'Total Officers' },
    { key: 'grading', label: 'Grading' },
    { key: 'remarks', label: 'Remarks' },
    { key: 'reportNo', label: 'Report No' },
    { key: 'authorityRank', label: 'Authority Rank' },
    { key: 'authorityName', label: 'Authority Name' },
    { key: 'station', label: 'Station' },
    { key: 'authorityTitle', label: 'Authority Title' },
    { key: 'reportDate', label: 'Report Date' },
    { key: 'orgNameHindi', label: 'Organization (Hindi)' },
    { key: 'orgNameEnglish', label: 'Organization (English)' },
  ]

  async function fetchAllReports() {
    const res = await fetch('/api/report?export=true')
    const data = await res.json()
    return data.reports || []
  }

  function fmtVal(report, key) {
    const v = report[key]
    if (v === null || v === undefined) return ''
    if (Array.isArray(v)) {
      return v.map((item) => Object.values(item).filter(Boolean).join(' ')).join('; ')
    }
    if (typeof v === 'string' && (key.startsWith('date') || key.startsWith('dateOf') || key === 'fromDate' || key === 'toDate' || key === 'departureDate' || key === 'dateOfSORS') && v.includes('-')) {
      const d = new Date(v)
      if (!isNaN(d.getTime())) return d.toLocaleDateString('en-GB')
    }
    return String(v)
  }

  function buildExportRows(reports) {
    return reports.map((r) => {
      const row = {}
      for (const f of EXPORT_FIELDS) {
        row[f.label] = fmtVal(r, f.key)
      }
      return row
    })
  }

  async function handleExportExcel() {
    const reports = await fetchAllReports()
    if (!reports.length) return alert('No reports to export')
    const rows = buildExportRows(reports)
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Reports')
    const colWidths = EXPORT_FIELDS.map(() => ({ wch: 18 }))
    ws['!cols'] = colWidths
    XLSX.writeFile(wb, 'Course_Reports.xlsx')
  }

  function handleDownloadDemo() {
    const headers = EXPORT_FIELDS.map((f) => f.label)
    const sampleRow = {}
    for (const f of EXPORT_FIELDS) {
      if (f.key === 'courseName') sampleRow[f.label] = 'OPC 214'
      else if (f.key === 'serialNo') sampleRow[f.label] = '1'
      else if (f.key === 'fromDate') sampleRow[f.label] = '01/01/2026'
      else if (f.key === 'toDate') sampleRow[f.label] = '31/12/2026'
      else if (f.key === 'icNo') sampleRow[f.label] = 'IC123456'
      else if (f.key === 'rank') sampleRow[f.label] = 'Captain'
      else if (f.key === 'name') sampleRow[f.label] = 'John Doe'
      else if (f.key === 'unit') sampleRow[f.label] = 'Unit Name'
      else if (f.key === 'corps') sampleRow[f.label] = 'Corps Name'
      else if (f.key === 'knowledge') sampleRow[f.label] = 'AVERAGE'
      else if (f.key === 'application') sampleRow[f.label] = 'AVERAGE'
      else if (f.key === 'grading') sampleRow[f.label] = 'Q'
      else if (f.key === 'foodPreference') sampleRow[f.label] = 'Veg'
      else sampleRow[f.label] = ''
    }
    const ws = XLSX.utils.json_to_sheet([sampleRow])
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' })
    XLSX.utils.sheet_add_json(ws, [sampleRow], { origin: 'A2', skipHeader: true })
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Template')
    const colWidths = EXPORT_FIELDS.map(() => ({ wch: 20 }))
    ws['!cols'] = colWidths
    XLSX.writeFile(wb, 'Demo_Import_Template.xlsx')
  }

  const fileInputRef = useRef(null)

  async function handleImportExcel(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const data = new Uint8Array(evt.target.result)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json(ws, { raw: false, defval: '' })
        if (!json.length) return alert('Excel file is empty')

        const labelToKey = {}
        for (const f of EXPORT_FIELDS) labelToKey[f.label] = f.key

        const records = json.map((row) => {
          const rec = {}
          for (const label of Object.keys(row)) {
            const key = labelToKey[label]
            if (key) rec[key] = String(row[label])
          }
          return rec
        })

        const res = await fetch('/api/report/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ records }),
        })

        if (!res.ok) {
          const err = await res.json()
          alert(err.error || 'Import failed')
          return
        }

        const result = await res.json()
        let msg = `Imported ${result.imported} of ${records.length} record(s)`
        if (result.errors?.length) {
          const sample = result.errors.slice(0, 5)
          msg += `\nErrors: ${sample.map((e) => `Row ${e.row}: ${e.error}`).join(', ')}`
          if (result.errors.length > 5) msg += ` (+${result.errors.length - 5} more)`
        }
        alert(msg)
        fetchReports()
      } catch {
        alert('Failed to parse Excel file')
      }
    }
    reader.readAsArrayBuffer(file)
    e.target.value = ''
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4">
      <Suspense fallback={null}><Toast /></Suspense>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-zinc-800">Course Reports</h1>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadDemo}
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700"
            >
              Demo Excel
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImportExcel}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700"
            >
              Import Excel
            </button>
            <button
              onClick={handleExportExcel}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
            >
              Excel
            </button>
            <button
              onClick={() => setShowGenerateModal(true)}
              disabled={generating || generatingPdf}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700 disabled:opacity-60"
            >
              {generating ? 'Generating DOCX...' : generatingPdf ? 'Generating PDF...' : 'Generate All Report'}
            </button>
            <a
              href="/add-entry"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
              + Add Entry
            </a>
          </div>
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            placeholder="Search name, IC, unit..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          />
          <input
            placeholder="Filter course..."
            value={courseFilter}
            onChange={(e) => { setCourseFilter(e.target.value); setPage(1) }}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          />
          <input
            placeholder="Filter rank..."
            value={rankFilter}
            onChange={(e) => { setRankFilter(e.target.value); setPage(1) }}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          />
          <select
            value={gradingFilter}
            onChange={(e) => { setGradingFilter(e.target.value); setPage(1) }}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Grading</option>
            <option value="Q">Q</option>
            <option value="QI">QI</option>
            <option value="FAIL">FAIL</option>

          </select>
          <select
            value={perPage}
            onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1) }}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          >
            {PER_PAGE_OPTIONS.map((n) => (
              <option key={n} value={n}>{n} per page</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-zinc-50 text-left text-xs font-semibold uppercase text-zinc-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">IC No</th>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Corps</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">To</th>
                <th className="px-4 py-3">Grading</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-zinc-400">Loading...</td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-zinc-400">No reports found</td></tr>
              ) : reports.map((r) => (
                <tr key={r._id} className="border-b hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-800">{r.name || '-'}</td>
                  <td className="px-4 py-3 text-zinc-600">{r.icNo || '-'}</td>
                  <td className="px-4 py-3 text-zinc-600">{r.rank || '-'}</td>
                  <td className="px-4 py-3 text-zinc-600">{r.unit || '-'}</td>
                  <td className="px-4 py-3 text-zinc-600">{r.corps || '-'}</td>
                  <td className="px-4 py-3 text-zinc-600 max-w-[150px] truncate" title={r.courseName}>{r.courseName || '-'}</td>
                  <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">{r.fromDate ? new Date(r.fromDate).toLocaleDateString('en-GB') : '-'}</td>
                  <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">{r.toDate ? new Date(r.toDate).toLocaleDateString('en-GB') : '-'}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">{r.grading || '-'}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <a
                        href={`/view?id=${r._id}`}
                        className="rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 hover:bg-purple-200"
                      >
                        View
                      </a>
                      <a
                        href={`/add-entry?id=${r._id}`}
                        className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => handleGenerateSingle(r)}
                        className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-200"
                      >
                        Report
                      </button>
                      <button
                        onClick={() => setDeleteTarget(r._id)}
                        className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm text-zinc-600">
            <span>Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, total)} of {total}</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="rounded border px-3 py-1 hover:bg-zinc-100 disabled:opacity-40"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                .map((p, idx, arr) => (
                  <span key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1">...</span>}
                    <button
                      onClick={() => setPage(p)}
                      className={`rounded px-3 py-1 ${p === page ? 'bg-blue-600 text-white' : 'border hover:bg-zinc-100'}`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="rounded border px-3 py-1 hover:bg-zinc-100 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-semibold text-zinc-800">Confirm Delete</h3>
            <p className="mb-6 text-sm text-zinc-600">Are you sure you want to delete this report? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-semibold text-zinc-800">Generate All Reports</h3>
            <p className="mb-6 text-sm text-zinc-600">Choose the format for generating all reports as a single file.</p>
            <div className="flex gap-3">
              <button
                onClick={handleGenerateDocx}
                className="flex-1 rounded-lg border-2 border-blue-600 px-4 py-3 text-center text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                <span className="block text-lg">📄</span>
                Word (DOCX)
              </button>
              <button
                onClick={handleGeneratePdf}
                className="flex-1 rounded-lg border-2 border-red-600 px-4 py-3 text-center text-sm font-semibold text-red-700 transition hover:bg-red-50"
              >
                <span className="block text-lg">📕</span>
                PDF
              </button>
              <button
                onClick={handleGenerateWeb}
                className="flex-1 rounded-lg border-2 border-teal-600 px-4 py-3 text-center text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
              >
                <span className="block text-lg">🌐</span>
                Web
              </button>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="text-sm text-zinc-500 underline hover:text-zinc-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
