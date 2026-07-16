import { NextResponse } from 'next/server'
import { connectDB, CourseReport } from '@/lib/db'

const ARRAY_FIELDS = ['civilQualification', 'militaryEducation', 'instrStaffAppt', 'postingRecord', 'familyDetails']

/**
 * Cast a single value to match the Mongoose schema type.
 * - Number fields: convert strings to numbers, non-numeric → undefined
 * - Date fields: parse DD/MM/YYYY format, otherwise try standard parsing
 * - Array subdocuments: recursively cast nested fields
 * - Other fields: pass through as-is
 */
function castValue(val, schemaPath) {
  if (val === null || val === undefined) return val
  if (!schemaPath) return val

  const instance = schemaPath.instance

  if (instance === 'Number') {
    if (typeof val === 'number') return val
    if (val === '' || val === null || val === undefined) return undefined
    const n = Number(val)
    return isNaN(n) ? undefined : n
  }

  if (instance === 'Date') {
    if (val instanceof Date) return val
    if (typeof val !== 'string') return undefined
    // Try DD/MM/YYYY format
    const parts = val.split('/')
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
      if (!isNaN(d.getTime())) return d
    }
    // Try ISO / standard parsing
    const d = new Date(val)
    return isNaN(d.getTime()) ? undefined : d
  }

  if (instance === 'Array' && Array.isArray(val)) {
    // Array of subdocuments — recursively cast nested fields
    if (schemaPath.schema) {
      return val.map((item) => {
        if (typeof item !== 'object' || item === null) return item
        const casted = { ...item }
        for (const [k, v] of Object.entries(casted)) {
          casted[k] = castValue(v, schemaPath.schema.paths[k])
        }
        return casted
      })
    }
    return val
  }

  return val
}

function castBody(body, schemaPaths) {
  const result = {}
  for (const [key, val] of Object.entries(body)) {
    result[key] = castValue(val, schemaPaths[key])
  }
  return result
}

export async function POST(request) {
  try {
    const { records } = await request.json()
    if (!records || !records.length) {
      return NextResponse.json({ error: 'No records provided' }, { status: 400 })
    }

    await connectDB()

    const schemaPaths = CourseReport.schema.paths

    let imported = 0
    const errors = []

    for (let i = 0; i < records.length; i++) {
      const body = { ...records[i] }

      // Parse array fields that might come as JSON strings
      for (const key of ARRAY_FIELDS) {
        if (body[key] && typeof body[key] === 'string') {
          try {
            body[key] = JSON.parse(body[key])
          } catch {
            body[key] = [body[key]]
          }
        }
      }

      const casted = castBody(body, schemaPaths)

      try {
        await CourseReport.create(casted)
        imported++
      } catch (err) {
        errors.push({ row: i + 1, icNo: body.icNo, error: err.message })
      }
    }

    return NextResponse.json({ imported, errors })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ error: 'Import failed' }, { status: 500 })
  }
}
