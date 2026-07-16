import { NextResponse } from 'next/server'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import fs from 'fs'
import path from 'path'
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

export async function POST(request) {
  try {
    const body = await request.json()
    const { fields, reports: clientReports } = body

    await connectDB()
    const reports = clientReports || await CourseReport.find().sort({ createdAt: -1 }).lean()
    if (!reports.length) {
      return NextResponse.json({ error: 'No reports' }, { status: 400 })
    }

    const templatePath = path.join(process.cwd(), 'public', '5 Course Report OPC  214.docx')
    const templateContent = fs.readFileSync(templatePath)

    const parts = []
    for (const r of reports) {
      try {
        const zip = new PizZip(templateContent)
        const data = {}
        for (const key of Object.keys(r)) {
          data[key] = fmtVal(r[key])
        }
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true })
        doc.render(data)
        const outZip = doc.getZip()
        const docXml = outZip.file('word/document.xml').asText()
        const innerMatch = docXml.match(/<w:body[^>]*>([\s\S]*)<\/w:body>/)
        if (innerMatch) parts.push(innerMatch[1])
      } catch { /* skip */ }
    }

    if (!parts.length) {
      return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
    }

    const mergedBody = parts.join('<w:p><w:r><w:br w:type="page"/></w:r></w:p>')

    const baseZip = new PizZip(templateContent)
    const baseDocXml = baseZip.file('word/document.xml').asText()
    const sectPr = '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/><w:cols w:space="720"/></w:sectPr>'

    let mergedXml = baseDocXml.replace(/<w:body[^>]*>([\s\S]*)<\/w:body>/, `<w:body>${mergedBody}</w:body>`)
    if (!mergedXml.includes('<w:sectPr')) {
      mergedXml = mergedXml.replace('</w:body>', sectPr + '</w:body>')
    }

    baseZip.file('word/document.xml', mergedXml)
    const output = baseZip.generate({ type: 'nodebuffer', compression: 'DEFLATE' })

    return new NextResponse(output, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="Custom_Report.docx"',
      },
    })
  } catch (error) {
    console.error('Custom report error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
