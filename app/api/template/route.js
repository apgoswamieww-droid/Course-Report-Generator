import { NextResponse } from 'next/server'
import { connectDB, ReportTemplate } from '@/lib/db'

export async function GET() {
  try {
    await connectDB()
    const templates = await ReportTemplate.find().sort({ createdAt: -1 }).lean()
    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error listing templates:', error)
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { name, title, fields } = await request.json()
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Template name is required' }, { status: 400 })
    }
    await connectDB()
    await ReportTemplate.findOneAndUpdate(
      { name: name.trim() },
      { name: name.trim(), title: title || 'Custom Report', fields: fields || [] },
      { upsert: true, new: true }
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving template:', error)
    return NextResponse.json({ error: 'Failed to save template' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    await connectDB()
    await ReportTemplate.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
  }
}
