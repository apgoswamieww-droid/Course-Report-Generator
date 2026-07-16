import { NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'

import { connectDB, CourseReport } from '@/lib/db'

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

function formatMonthYear(val) {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return ''
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return months[d.getMonth()] + ' ' + d.getFullYear()
}

function y(doc, opts, fallback) {
  const r = autoTable(doc, opts)
  return r ? r.finalY : fallback
}

const M = 10
const PW = 210

export async function POST() {
  try {
    await connectDB()
    const reports = await CourseReport.find().sort({ createdAt: -1 }).lean()
    if (!reports.length) {
      return NextResponse.json({ error: 'No reports found' }, { status: 400 })
    }

    const doc = new jsPDF('p', 'mm', 'a4')

    for (let idx = 0; idx < reports.length; idx++) {
      const r = reports[idx]
      if (idx > 0) doc.addPage()

      let curY = M
      const opts = (body, startY) => ({
        startY,
        body,
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 1.5 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 22 }, 1: { cellWidth: 'auto' } },
        margin: { left: M, right: M },
        tableWidth: PW - M * 2,
      })

      const C = PW - M * 2

      // ── Profile table ──
      curY = y(doc, opts([
        [{ content: 'Course :', styles: { fontStyle: 'bold' } }, { content: fmtVal(r.courseName), colSpan: 3 }, { content: 'Serial No :', styles: { fontStyle: 'bold' } }, { content: fmtVal(r.serialNo), colSpan: 3 }],
        [{ content: 'From :', styles: { fontStyle: 'bold' } }, { content: fmtDate(r.fromDate), colSpan: 3 }, { content: 'To :', styles: { fontStyle: 'bold' } }, { content: fmtDate(r.toDate), colSpan: 3 }],
        [{ content: 'No :', styles: { fontStyle: 'bold' } }, { content: fmtVal(r.icNo), colSpan: 1 }, { content: 'Rank :', styles: { fontStyle: 'bold' } }, { content: fmtVal(r.rank), colSpan: 1 }, { content: 'Name :', styles: { fontStyle: 'bold' } }, { content: fmtVal(r.name), colSpan: 3 }],
        [{ content: 'Unit :', styles: { fontStyle: 'bold' } }, { content: fmtVal(r.unit), colSpan: 3 }, { content: 'Corps :', styles: { fontStyle: 'bold' } }, { content: fmtVal(r.corps), colSpan: 3 }],
      ], curY), curY) + 2

      // ── Knowledge / Application table ──
      curY = y(doc, opts([
        [{ content: 'Knowledge :', styles: { fontStyle: 'bold' } }, { content: fmtVal(r.knowledge), colSpan: 3 }, { content: 'Application :', styles: { fontStyle: 'bold' } }, { content: fmtVal(r.application), colSpan: 3 }],
      ], curY), curY) + 2

      // ── Pen Picture table ──
      const pen = r.penPicture ? r.penPicture.replace(/<[^>]*>/g, '') : ''
      curY = y(doc, opts([
        [{ content: 'Pen Picture :', styles: { fontStyle: 'bold' } }, { content: pen, colSpan: 7 }],
      ], curY), curY) + 2

      // ── Grading / Course Symbol / Instructional Ability table ──
      curY = y(doc, opts([
        [{ content: 'Grading :', styles: { fontStyle: 'bold' } }, { content: fmtVal(r.grading) }, { content: 'Course Symbol :', styles: { fontStyle: 'bold' } }, { content: fmtVal(r.courseSymbol), colSpan: 5 }],
        [{ content: 'Instructional Ability :', styles: { fontStyle: 'bold' } }, { content: fmtVal(r.instructionalAbility), colSpan: 7 }],
      ], curY), curY) + 2

      // ── Signing Authority ──
      if (curY > 230) { doc.addPage(); curY = M }

      const authName = fmtVal(r.authorityName)
      curY = y(doc, {
        startY: curY,
        body: [
          [{ content: '', styles: { cellWidth: C } }],
        ],
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 0.5 },
        margin: { left: M, right: M },
        tableWidth: C,
      }, curY) + 1

      curY = y(doc, {
        startY: curY,
        body: [
          [{ content: authName, styles: { halign: 'right', fontStyle: 'bold' }, colSpan: 4 }],
        ],
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 1 },
        margin: { left: M, right: M },
        tableWidth: C,
      }, curY) + 2

      const mY = formatMonthYear(r.reportDate)
      const org = fmtVal(r.orgNameHindi || r.orgNameEnglish)
      curY = y(doc, {
        startY: curY,
        body: [
          [{ content: 'No :', styles: { fontStyle: 'bold', cellWidth: 12 } }, { content: fmtVal(r.reportNo) }, { content: 'OPC-214/G' }, { content: fmtVal(r.authorityRank), styles: { halign: 'right' } }],
          [{ content: 'Station :', styles: { fontStyle: 'bold', cellWidth: 12 } }, { content: fmtVal(r.station) }, { content: '' }, { content: fmtVal(r.authorityTitle), styles: { halign: 'right' } }],
          [{ content: 'Date :', styles: { fontStyle: 'bold', cellWidth: 12 } }, { content: fmtDate(r.reportDate) }, { content: mY }, { content: org, styles: { halign: 'right' } }],
        ],
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 1.5 },
        margin: { left: M, right: M },
        tableWidth: C,
      }, curY)
    }

    const pageCount = doc.internal.getNumberOfPages()
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(128, 128, 128)
      doc.text(`Page ${p} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 8, { align: 'center' })
    }

    const buf = Buffer.from(doc.output('arraybuffer'))
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="All_Reports.pdf"',
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
