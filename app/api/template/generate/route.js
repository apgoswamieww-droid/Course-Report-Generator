import { NextResponse } from 'next/server'
import PizZip from 'pizzip'
import { connectDB, CourseReport, ReportTemplate } from '@/lib/db'

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

function buildDocx(template, reports) {
  const zip = new PizZip()

  const fields = (template.fields || []).sort((a, b) => a.y - b.y || a.x - b.x)

  const ROW_GAP = 20
  const rows = []
  for (const f of fields) {
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

  const escapeXml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Build document XML
  let bodyXml = ''

  // Styles
  bodyXml += `<w:styles><w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:pPr><w:jc w:val="center"/><w:spacing w:after="200"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="28"/></w:rPr>
  </w:style></w:styles>`

  for (let i = 0; i < reports.length; i++) {
    const r = reports[i]

    // Page break before each report except first
    if (i > 0) {
      bodyXml += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`
    }

    // Title
    bodyXml += `<w:p><w:pPr><w:pStyle w:val="Title"/></w:pPr><w:r><w:t>${escapeXml(template.title)}</w:t></w:r></w:p>`

    // Subtitle
    bodyXml += `<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="18"/></w:rPr><w:t>Record #${i + 1} - ${escapeXml(r.name || '')} (${escapeXml(r.icNo || '')})</w:t></w:r></w:p>`

    // Table for each row
    for (const row of rows) {
      const cellWidth = Math.floor(9000 / Math.max(row.fields.length, 1))
      bodyXml += `<w:tbl><w:tblPr><w:tblW w:w="9000" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="4"/><w:left w:val="single" w:sz="4"/><w:bottom w:val="single" w:sz="4"/><w:right w:val="single" w:sz="4"/><w:insideH w:val="single" w:sz="4"/><w:insideV w:val="single" w:sz="4"/></w:tblBorders></w:tblPr><w:tblGrid>`
      for (let c = 0; c < row.fields.length; c++) {
        bodyXml += `<w:gridCol w:w="${cellWidth}"/>`
      }
      bodyXml += `</w:tblGrid><w:tr>`
      for (const f of row.fields) {
        const val = fmtVal(r[f.key])
        bodyXml += `<w:tc><w:tcW w:w="${cellWidth}" w:type="dxa"/><w:p><w:r><w:rPr><w:b/><w:sz w:val="18"/></w:rPr><w:t>${escapeXml(f.label)}:</w:t></w:r></w:p><w:p><w:r><w:rPr><w:sz w:val="18"/></w:rPr><w:t>${escapeXml(val || '-')}</w:t></w:r></w:p></w:tc>`
      }
      bodyXml += `</w:tr></w:tbl>`
    }
  }

  const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${bodyXml}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`

  zip.file('word/document.xml', docXml)
  zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
  zip.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
  zip.file('word/_rels/document.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>')

  return zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' })
}

export async function POST(request) {
  try {
    const { templateId } = await request.json()
    if (!templateId) {
      return NextResponse.json({ error: 'Missing templateId' }, { status: 400 })
    }

    await connectDB()
    const template = await ReportTemplate.findById(templateId).lean()
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    const reports = await CourseReport.find().sort({ createdAt: -1 }).lean()
    if (!reports.length) {
      return NextResponse.json({ error: 'No reports found' }, { status: 400 })
    }

    const buffer = buildDocx(template, reports)
    const filename = `${template.name.replace(/\s+/g, '_')}.docx`

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error generating from template:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
