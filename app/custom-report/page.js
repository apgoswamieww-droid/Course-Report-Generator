'use client'

import { useState, useEffect, useRef } from 'react'
import * as XLSX from 'xlsx'

const ALL_FIELDS = [
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

const FIELD_W = 180
const FIELD_H = 42

let nextId = 1

function fmtDate(val) {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return String(val)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

function fmtVal(val) {
  if (val === null || val === undefined) return ''
  if (val instanceof Date) return fmtDate(val)
  return String(val)
}

export default function CustomReportPage() {
  const [reports, setReports] = useState([])
  const [canvasFields, setCanvasFields] = useState([])
  const [dragField, setDragField] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewData, setPreviewData] = useState([])
  const [title, setTitle] = useState('Custom Report')
  const [templates, setTemplates] = useState([])
  const [templateName, setTemplateName] = useState('')
  const [saveMsg, setSaveMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const canvasRef = useRef(null)

  function loadReports() {
    setLoading(true)
    setFetchError('')
    fetch('/api/report?export=true', { credentials: 'include' })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((d) => setReports(d.reports || []))
      .catch((e) => setFetchError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadReports()
    fetch('/api/template')
      .then((r) => r.json())
      .then((d) => setTemplates(d.templates || []))
      .catch(() => {})
  }, [])

  const usedFields = canvasFields

  function getLayoutRows() {
    const sorted = [...canvasFields].sort((a, b) => a.y - b.y || a.x - b.x)
    const rows = []
    const ROW_GAP = 20
    for (const f of sorted) {
      let placed = false
      for (const row of rows) {
        if (Math.abs(row.avgY - f.y) < ROW_GAP) {
          row.fields.push(f)
          row.avgY = row.fields.reduce((s, ff) => s + ff.y, 0) / row.fields.length
          placed = true
          break
        }
      }
      if (!placed) rows.push({ avgY: f.y, fields: [f] })
    }
    for (const row of rows) row.fields.sort((a, b) => a.x - b.x)
    return rows.map((r) => r.fields)
  }

  function handleFieldDragStart(e, field) {
    setDragField(field)
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('text/plain', field.key)
  }

  function handleCanvasDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  function handleCanvasDrop(e) {
    e.preventDefault()
    if (!dragField) return
    if (canvasFields.some((f) => f.key === dragField.key)) return

    const rect = canvasRef.current.getBoundingClientRect()
    let x = e.clientX - rect.left - FIELD_W / 2
    let y = e.clientY - rect.top - 10
    x = Math.max(0, x)
    y = Math.max(0, y)

    const newField = { id: nextId++, key: dragField.key, label: dragField.label, x, y, width: FIELD_W }
    setCanvasFields([...canvasFields, newField])
    setDragField(null)
  }

  function handleFieldMouseDown(e, field) {
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    const startFieldX = field.x
    const startFieldY = field.y

    function onMouseMove(ev) {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      setCanvasFields((prev) =>
        prev.map((f) =>
          f.id === field.id
            ? { ...f, x: Math.max(0, startFieldX + dx), y: Math.max(0, startFieldY + dy) }
            : f
        )
      )
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  function handleResizeMouseDown(e, field) {
    e.preventDefault()
    e.stopPropagation()
    const startX = e.clientX
    const startW = field.width

    function onMouseMove(ev) {
      const dw = ev.clientX - startX
      setCanvasFields((prev) =>
        prev.map((f) =>
          f.id === field.id ? { ...f, width: Math.max(80, startW + dw) } : f
        )
      )
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  function removeField(id) {
    setCanvasFields((prev) => prev.filter((f) => f.id !== id))
  }

  function clearCanvas() {
    setCanvasFields([])
  }

  function handlePreview() {
    if (!canvasFields.length) return alert('Drop fields onto the canvas first')
    const layout = getLayoutRows()
    const data = reports.map((r) =>
      layout.map((row) =>
        row.map((f) => ({ label: f.label, value: fmtVal(r[f.key]) }))
      )
    )
    setPreviewData(data)
    setPreviewOpen(true)
  }

  function handleExportExcel() {
    if (!canvasFields.length) return alert('Drop fields onto the canvas first')
    const layout = getLayoutRows()
    const headers = layout.map((row) => row.map((f) => f.label))
    const rows = reports.map((r) => {
      const row = {}
      for (const fields of layout) {
        for (const f of fields) row[f.label] = fmtVal(r[f.key])
      }
      return row
    })
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'CustomReport')
    ws['!cols'] = layout.flat().map(() => ({ wch: 18 }))
    XLSX.writeFile(wb, 'Custom_Report.xlsx')
  }

  function handleExportWeb() {
    if (!canvasFields.length) return alert('Drop fields onto the canvas first')
    const layout = getLayoutRows()
    const win = window.open('', '_blank')
    let html = `<html><head><title>${title}</title>
    <style>
      body { font-family: Arial; padding: 20px; font-size: 9pt; }
      h1 { font-size: 14pt; margin-bottom: 12pt; }
      .report { page-break-after: always; margin-bottom: 15pt; border: 1px solid #ccc; padding: 10pt; }
      .report:last-child { page-break-after: auto; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 4pt; }
      td { border: 1px solid #ddd; padding: 3pt 5pt; font-size: 8pt; }
      .lbl { font-weight: bold; background: #f5f5f5; width: 1%; white-space: nowrap; }
    </style></head><body>
    <div class="no-print"><button onclick="window.print()">Print</button></div>
    <h1>${title}</h1>`
    for (const r of reports) {
      html += '<div class="report">'
      for (const row of layout) {
        html += '<table><tr>'
        for (const f of row) {
          const val = fmtVal(r[f.key])
          html += `<td class="lbl">${f.label}</td><td>${val || '-'}</td>`
        }
        html += '</tr></table>'
      }
      html += '</div>'
    }
    html += '</body></html>'
    win.document.write(html)
    win.document.close()
  }

  async function handleExportPDF() {
    if (!canvasFields.length) return alert('Drop fields onto the canvas first')
    const layout = getLayoutRows()
    const { jsPDF } = await import('jspdf')
    const { autoTable } = await import('jspdf-autotable')
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageW = 190
    const margin = 10
    let y = 15

    for (let i = 0; i < reports.length; i++) {
      if (i > 0) doc.addPage()
      y = 15
      doc.setFontSize(14)
      doc.text(title, pageW / 2, y, { align: 'center' })
      y += 8
      doc.setFontSize(8)
      doc.text(`Record #${i + 1} - ${reports[i].name || ''} (${reports[i].icNo || ''})`, pageW / 2, y, { align: 'center' })
      y += 6

      const r = reports[i]
      for (const row of layout) {
        const n = row.length
        const colW = (pageW - 2 * margin) / n
        const body = row.map((f) => [
          { content: f.label, styles: { fontSize: 7, fontStyle: 'bold', fillColor: [245, 245, 245] } },
          { content: fmtVal(r[f.key]) || '-', styles: { fontSize: 7 } },
        ])
        autoTable(doc, {
          body,
          startY: y,
          theme: 'grid',
          styles: { fontSize: 7, cellPadding: 1.5 },
          columnStyles: { 0: { cellWidth: colW * 0.35 }, 1: { cellWidth: colW * 0.65 } },
          margin: { left: margin, right: margin },
          tableWidth: pageW - 2 * margin,
        })
        y = doc.lastAutoTable.finalY + 2
      }
    }

    doc.save(`${title.replace(/\s+/g, '_')}.pdf`)
  }

  async function handleSaveTemplate() {
    const name = templateName.trim()
    if (!name) return alert('Enter a template name')
    const fields = canvasFields.map((f) => ({ key: f.key, label: f.label, x: f.x, y: f.y, width: f.width }))
    try {
      const res = await fetch('/api/template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, title, fields }),
      })
      if (!res.ok) return alert('Failed to save template')
      const saved = await fetch('/api/template')
      const data = await saved.json()
      setTemplates(data.templates || [])
      setTemplateName('')
      setSaveMsg(`Saved "${name}"`)
      setTimeout(() => setSaveMsg(''), 2000)
    } catch {
      alert('Failed to save template')
    }
  }

  function handleLoadTemplate(t) {
    setTitle(t.title)
    setCanvasFields((t.fields || []).map((f) => ({ ...f, id: nextId++ })))
  }

  async function handleDeleteTemplate(id) {
    try {
      await fetch(`/api/template?id=${id}`, { method: 'DELETE' })
      setTemplates((prev) => prev.filter((t) => t._id !== id))
    } catch {
      alert('Failed to delete template')
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-zinc-800">Form Designer</h1>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-zinc-700">Fields</h2>
            <div
              className="max-h-[50vh] space-y-1 overflow-y-auto"
              onDragOver={(e) => e.preventDefault()}
            >
              {ALL_FIELDS.map((f) => {
                const isUsed = canvasFields.some((u) => u.key === f.key)
                return (
                  <div
                    key={f.key}
                    draggable={!isUsed}
                    onDragStart={(e) => handleFieldDragStart(e, f)}
                    className={`cursor-grab rounded px-2 py-1.5 text-xs transition ${
                      isUsed
                        ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                        : 'hover:bg-blue-50 text-zinc-700 active:cursor-grabbing'
                    }`}
                  >
                    {isUsed ? '✓ ' : '⠿ '}{f.label}
                  </div>
                )
              })}
            </div>
            <p className="mt-2 text-[10px] text-zinc-400">Drag fields onto the canvas. Drag to reposition, resize by right edge.</p>
          </div>

          {/* Title */}
          <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <label className="mb-1 block text-xs font-medium text-zinc-600">Report Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Templates */}
          <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-zinc-700">Templates</h2>
            <div className="flex gap-2">
              <input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Template name"
                className="flex-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleSaveTemplate}
                className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
            {saveMsg && <p className="mt-1 text-xs text-emerald-600">{saveMsg}</p>}
            {templates.length > 0 && (
              <div className="mt-3 space-y-1">
                {templates.map((t) => (
                  <div key={t._id} className="flex items-center justify-between rounded bg-zinc-50 px-2 py-1">
                    <button
                      onClick={() => handleLoadTemplate(t)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {t.name}
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(t._id)}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Free-form Canvas */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border-2 border-dashed border-zinc-300 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-zinc-700">Design Canvas</h2>
                <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                  {canvasFields.length} field(s)
                </span>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                  {loading ? 'Loading...' : `${reports.length} record(s)`}
                </span>
              </div>
              <div className="flex gap-2">
                {fetchError && <span className="text-xs text-red-500">Fetch error: {fetchError}</span>}
                <button onClick={loadReports} className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-200">
                  Refresh Data
                </button>
                <button onClick={clearCanvas} className="rounded bg-red-50 px-2 py-1 text-xs text-red-500 hover:bg-red-100">
                  Clear All
                </button>
              </div>
            </div>

            <div
              ref={canvasRef}
              onDragOver={handleCanvasDragOver}
              onDrop={handleCanvasDrop}
              className="relative w-full rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50/50"
              style={{ height: canvasFields.length === 0 ? 500 : Math.max(500, Math.max(...canvasFields.map((f) => f.y)) + FIELD_H + 30) }}
            >
              {canvasFields.length === 0 && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-zinc-400">
                  Drag &amp; drop fields here
                </div>
              )}
              {canvasFields.map((f) => (
                <div
                  key={f.id}
                  onMouseDown={(e) => handleFieldMouseDown(e, f)}
                  className="absolute flex items-center justify-between rounded-lg border-2 border-blue-300 bg-blue-50 px-2.5 py-1.5 text-xs shadow-sm hover:shadow-md hover:border-blue-400 cursor-move select-none"
                  style={{
                    left: f.x,
                    top: f.y,
                    width: f.width,
                    height: FIELD_H,
                  }}
                >
                  <span className="truncate font-semibold text-blue-700">{f.label}</span>
                  <div className="flex items-center gap-1">
                    <span className="hidden text-[9px] text-zinc-400 group-hover:inline">[{f.key}]</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeField(f.id) }}
                      className="flex h-4 w-4 items-center justify-center rounded-full bg-red-400 text-[9px] text-white hover:bg-red-500"
                    >
                      ✕
                    </button>
                  </div>
                  {/* Resize handle */}
                  <div
                    onMouseDown={(e) => handleResizeMouseDown(e, f)}
                    className="absolute right-0 top-0 h-full w-2 cursor-col-resize hover:bg-blue-300/50 rounded-r"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-3 border-t border-zinc-100 pt-4">
              <button
                onClick={handlePreview}
                disabled={!canvasFields.length}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                Preview
              </button>
              <button
                onClick={handleExportExcel}
                disabled={!canvasFields.length}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                Excel
              </button>
              <button
                onClick={handleExportWeb}
                disabled={!canvasFields.length}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
              >
                Web / Print
              </button>
              <button
                onClick={handleExportPDF}
                disabled={!canvasFields.length}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
              >
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 pt-10">
          <div className="relative mb-10 w-full max-w-4xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-800">Preview: {title}</h3>
              <button
                onClick={() => setPreviewOpen(false)}
                className="rounded-lg bg-zinc-100 px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-200"
              >
                Close
              </button>
            </div>
            <div className="space-y-4">
              {previewData.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-400">No records found. Add some reports first.</p>
              ) : (
                previewData.slice(0, 3).map((rows, ri) => (
                  <div key={ri} className="rounded-lg border border-zinc-200 p-3">
                    <div className="mb-2 text-xs font-semibold text-zinc-500">Record #{ri + 1}</div>
                    {rows.map((cells, ci) => (
                      <div key={ci} className="flex flex-wrap gap-1 border-b border-zinc-100 py-1.5">
                        {cells.map((cell) => (
                          <div key={cell.label} className="flex items-center gap-1 rounded bg-zinc-50 px-2 py-0.5 text-[10px]">
                            <span className="font-semibold text-zinc-700">{cell.label}:</span>
                            <span className="text-zinc-600">{cell.value || '-'}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))
              )}
              {previewData.length > 3 && (
                <p className="text-xs text-zinc-400">Showing first 3 of {previewData.length} records</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
