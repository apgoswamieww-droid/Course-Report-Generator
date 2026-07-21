import { NextResponse } from 'next/server'
import PizZip from 'pizzip'
import { connectDB, CourseReport } from '@/lib/db'
import { generateDocxBuffer } from '@/lib/generate-report'
import { uploadFile, deleteFileByUrl } from '@/lib/cloudinary'

const ARRAY_FIELDS = ['civilQualification', 'militaryEducation', 'instrStaffAppt', 'postingRecord', 'familyDetails']

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const report = await CourseReport.findById(id).lean()
      if (!report) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json({ report })
    }

    const isExport = searchParams.get('export') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('perPage') || '10')
    const search = searchParams.get('search') || ''
    const courseFilter = searchParams.get('course') || ''
    const rankFilter = searchParams.get('rank') || ''
    const gradingFilter = searchParams.get('grading') || ''

    const filter = {}
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { icNo: { $regex: search, $options: 'i' } },
        { unit: { $regex: search, $options: 'i' } },
        { corps: { $regex: search, $options: 'i' } },
      ]
    }
    if (courseFilter) filter.courseName = { $regex: courseFilter, $options: 'i' }
    if (rankFilter) filter.rank = { $regex: rankFilter, $options: 'i' }
    if (gradingFilter) filter.grading = gradingFilter

    const total = await CourseReport.countDocuments(filter)
    let query = CourseReport.find(filter).sort({ createdAt: -1 }).lean()

    if (isExport) {
      query = query.select('-__v')
    } else {
      query = query
        .skip((page - 1) * perPage)
        .limit(perPage)
        .select('name icNo rank unit corps courseName fromDate toDate grading courseSymbol createdAt knowledge application')
    }

    const reports = await query

    if (isExport) {
      return NextResponse.json({ reports })
    }
    return NextResponse.json({ reports, total, page, perPage, totalPages: Math.ceil(total / perPage) })
  } catch (error) {
    console.error('Error listing reports:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const report = await CourseReport.findById(id).lean()
    if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 })

    const fileFields = ['admInfoDoc', 'movementOrderDoc', 'lrcDoc', 'willingnessCertDoc', 'medicalCertDoc', 'nominalRollDoc', 'etgDoc', 'cyberSecurityCertDoc', 'appxFAODoc', 'teiFeedbackDoc', 'admFeedbackDoc', 'mutualAssessmentDoc', 'withFamilyDoc']
    for (const field of fileFields) {
      if (report[field]) await deleteFileByUrl(report[field])
    }

    await CourseReport.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting report:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

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
    await CourseReport.findByIdAndUpdate(id, body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating report:', error)
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.formData()
    const body = {}

    for (const [key, val] of data.entries()) {
      if (ARRAY_FIELDS.includes(key)) {
        try { body[key] = JSON.parse(val) } catch { body[key] = [] }
      } else if (val instanceof File) {
        body[key] = await uploadFile(val)
      } else {
        body[key] = val
      }
    }

    const buffer = generateDocxBuffer(body)
    const filename = `Report_${body.icNo || 'draft'}.docx`

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
