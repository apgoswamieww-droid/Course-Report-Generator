import { NextResponse } from 'next/server'
import PizZip from 'pizzip'
import fs from 'fs'
import path from 'path'
import { connectDB, CourseReport } from '@/lib/db'
import { generateDocxBuffer, addPageNumberFooter } from '@/lib/generate-report'

export async function POST() {
  try {
    await connectDB()
    const reports = await CourseReport.find().sort({ createdAt: -1 }).lean()
    if (!reports.length) return NextResponse.json({ error: 'No reports found' }, { status: 400 })

    const templatePath = path.join(process.cwd(), 'public', '5 Course Report OPC  214.docx')
    const templateContent = fs.readFileSync(templatePath)

    const bodies = []
    for (const r of reports) {
      try {
        const buf = generateDocxBuffer(r)
        const zip = new PizZip(buf)
        const docXml = zip.file('word/document.xml').asText()
        // Extract only the inner <w:body> content (without the <w:body> wrapper itself)
        const innerMatch = docXml.match(/<w:body[^>]*>([\s\S]*)<\/w:body>/)
        if (innerMatch) {
          bodies.push(innerMatch[1])
        }
      } catch {
        // skip individual failures
      }
    }

    if (!bodies.length) return NextResponse.json({ error: 'Failed to generate reports' }, { status: 500 })

    const mergedBody = bodies.join('<w:p><w:r><w:br w:type="page"/></w:r></w:p>')

    const DEFAULT_SECTPR = '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/><w:cols w:space="720"/></w:sectPr>'

    const baseZip = new PizZip(templateContent)
    const baseDocXml = baseZip.file('word/document.xml').asText()

    // Replace the body tag in the base template with the merged content
    const mergedXml = baseDocXml.replace(/<w:body[^>]*>([\s\S]*)<\/w:body>/, `<w:body>${mergedBody}</w:body>`)

    // The template file is missing <w:sectPr> (section properties).
    // Without it, LibreOffice/Word cannot determine page layout for multi-page docs.
    // Add a default A4 section property before </w:body> AFTER the body replacement
    // so it isn't overwritten.
    const finalXml = mergedXml.includes('<w:sectPr')
      ? mergedXml
      : mergedXml.replace('</w:body>', DEFAULT_SECTPR + '</w:body>')

    baseZip.file('word/document.xml', finalXml)

    // Add page number footer to the merged document
    addPageNumberFooter(baseZip)

    const output = baseZip.generate({ type: 'nodebuffer', compression: 'DEFLATE' })

    return new NextResponse(output, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="All_Reports.docx"',
      },
    })
  } catch (error) {
    console.error('Error generating all reports:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
