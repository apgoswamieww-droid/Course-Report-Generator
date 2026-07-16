import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { connectDB, CourseReport } from '@/lib/db'

const ARRAY_FIELDS = ['civilQualification', 'militaryEducation', 'instrStaffAppt', 'postingRecord', 'familyDetails']

export async function POST(request) {
  try {
    const data = await request.formData()
    const body = {}
    const fileEntries = []

    for (const [key, val] of data.entries()) {
      if (ARRAY_FIELDS.includes(key)) {
        try { body[key] = JSON.parse(val) } catch { body[key] = [] }
      } else if (val instanceof File) {
        fileEntries.push([key, val])
      } else {
        body[key] = val
      }
    }

    for (const [key, val] of fileEntries) {
      const icNo = body.icNo || 'unknown'
      const baseDir = path.join(process.cwd(), 'public', 'uploads', icNo)
      if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true })
      const filename = `${Date.now()}-${val.name.replace(/\s+/g, '_')}`
      fs.writeFileSync(path.join(baseDir, filename), Buffer.from(await val.arrayBuffer()))
      body[key] = `/uploads/${icNo}/${filename}`
    }

    await connectDB()
    await CourseReport.create(body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error storing report:', error)
    return NextResponse.json({ error: 'Failed to store report' }, { status: 500 })
  }
}
