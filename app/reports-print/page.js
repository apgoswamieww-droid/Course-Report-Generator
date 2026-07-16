export const dynamic = 'force-dynamic'

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

export const metadata = {
  title: 'All Reports',
}

export default async function ReportsPrintPage() {
  await connectDB()
  const reports = await CourseReport.find().sort({ createdAt: -1 }).lean()

  return (
    <>
      <style>{`
        @page { margin: 10mm 8mm }
        @media print {
          .report { page-break-after: always; }
          .report:last-child { page-break-after: auto; }
        }
        body { font-family: Arial, sans-serif; font-size: 8pt; margin: 0; padding: 0; color: #000; }
        .report { padding: 5mm; }
        table { width: 100%; border-collapse: collapse; }
        td, th { border: 0.5pt solid #333; padding: 2pt 3pt; vertical-align: top; font-size: 8pt; }
        .lbl { font-weight: bold; white-space: nowrap; }
        .val { }
        .sec { font-weight: bold; text-align: center; background: #e8e8e8; }
      `}</style>
      {reports.map((r) => (
        <div key={r._id.toString()} className="report">
          <table>
            <tbody>
              <tr>
                <td className="lbl" width="14%">Course :</td>
                <td className="val" width="36%" colSpan="2">{fmtVal(r.courseName)}</td>
                <td className="lbl" width="16%">Serial No :</td>
                <td className="val" width="34%" colSpan="2">{fmtVal(r.serialNo)}</td>
              </tr>
              <tr>
                <td className="lbl">From :</td>
                <td className="val" colSpan="2">{fmtDate(r.fromDate)}</td>
                <td className="lbl">To :</td>
                <td className="val" colSpan="2">{fmtDate(r.toDate)}</td>
              </tr>
              <tr>
                <td className="lbl">No :</td>
                <td className="val" width="22%">{fmtVal(r.icNo)}</td>
                <td className="lbl" width="8%">Rank :</td>
                <td className="val" width="22%">{fmtVal(r.rank)}</td>
                <td className="lbl" width="8%">Name :</td>
                <td className="val" width="22%">{fmtVal(r.name)}</td>
              </tr>
              <tr>
                <td className="lbl">Unit :</td>
                <td className="val" colSpan="2">{fmtVal(r.unit)}</td>
                <td className="lbl">Corps :</td>
                <td className="val" colSpan="2">{fmtVal(r.corps)}</td>
              </tr>
            </tbody>
          </table>

          <table>
            <tbody>
              <tr>
                <td className="lbl" width="16%">Knowledge :</td>
                <td className="val">{fmtVal(r.knowledge)}</td>
                <td className="lbl" width="20%">Application :</td>
                <td className="val">{fmtVal(r.application)}</td>
              </tr>
            </tbody>
          </table>

          <table>
            <tbody>
              <tr>
                <td className="lbl" width="16%">Pen Picture :</td>
                <td className="val" style={{ whiteSpace: 'pre-wrap' }}>
                  {r.penPicture ? r.penPicture.replace(/<[^>]*>/g, '') : ''}
                </td>
              </tr>
            </tbody>
          </table>

          <table>
            <tbody>
              <tr>
                <td className="lbl" width="12%">Grading :</td>
                <td className="val" width="18%">{fmtVal(r.grading)}</td>
                <td className="lbl" width="20%">Course Symbol :</td>
                <td className="val">{fmtVal(r.courseSymbol)}</td>
              </tr>
              <tr>
                <td className="lbl">Instructional Ability :</td>
                <td className="val" colSpan="3">{fmtVal(r.instructionalAbility)}</td>
              </tr>
            </tbody>
          </table>

          <table>
            <tbody>
              <tr>
                <td className="val" style={{ textAlign: 'right', borderBottom: 'none', paddingBottom: '6pt' }}>
                  {fmtVal(r.authorityName)}
                </td>
              </tr>
            </tbody>
          </table>

          <table>
            <tbody>
              <tr>
                <td className="lbl" width="8%">No :</td>
                <td className="val" width="20%">{fmtVal(r.reportNo)}</td>
                <td className="val" width="30%">OPC-214/G</td>
                <td className="val" width="42%" style={{ textAlign: 'right' }}>{fmtVal(r.authorityRank)}</td>
              </tr>
              <tr>
                <td className="lbl">Station :</td>
                <td className="val">{fmtVal(r.station)}</td>
                <td></td>
                <td className="val" style={{ textAlign: 'right' }}>{fmtVal(r.authorityTitle)}</td>
              </tr>
              <tr>
                <td className="lbl">Date :</td>
                <td className="val">{fmtDate(r.reportDate)}</td>
                <td className="val">{formatMonthYear(r.reportDate)}</td>
                <td className="val" style={{ textAlign: 'right' }}>{fmtVal(r.orgNameHindi || r.orgNameEnglish)}</td>
              </tr>
              {r.orgNameEnglish && r.orgNameHindi && (
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="val" style={{ textAlign: 'right' }}>{fmtVal(r.orgNameEnglish)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </>
  )
}
