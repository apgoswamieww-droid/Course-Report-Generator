import { NextResponse } from 'next/server'
import { connectDB, CourseReport } from '@/lib/db'
import { uploadFile } from '@/lib/cloudinary'

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
      body[key] = await uploadFile(val)
    }

    await connectDB()
    await CourseReport.create(body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error storing report:', error)
    return NextResponse.json({ error: error.message || 'Failed to store report' }, { status: 500 })
  }
}
