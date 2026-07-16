'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const labelCls = 'mb-1 block text-sm font-medium text-zinc-700'
const valueCls = 'rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-800 min-h-[38px]'
const sectionTitleCls = 'mb-4 pb-2 border-b border-zinc-200 text-lg font-semibold text-zinc-800'

const DOC_FIELDS = [
  ['Adm Info', 'admInfo', 'admInfoDoc'],
  ['Movement Order', 'movementOrder', 'movementOrderDoc'],
  ['LRC', 'lrc', 'lrcDoc'],
  ['Willingness Certificate', 'willingnessCert', 'willingnessCertDoc'],
  ['Medical Certificate', 'medicalCert', 'medicalCertDoc'],
  ['Nominal Roll', 'nominalRoll', 'nominalRollDoc'],
  ['ETG', 'etg', 'etgDoc'],
  ['Cyber Security Cert', 'cyberSecurityCert', 'cyberSecurityCertDoc'],
  ["Appx 'F' to AO 09/2011/DGMS", 'appxFAO', 'appxFAODoc'],
  ['TEI Feedback', 'teiFeedback', 'teiFeedbackDoc', 'teiFeedbackPoints'],
  ['Adm Feedback', 'admFeedback', 'admFeedbackDoc', 'admFeedbackPoints'],
  ['Mutual Assessment', 'mutualAssessment', 'mutualAssessmentDoc'],
  ['With Family', 'withFamily', 'withFamilyDoc'],
]

function Field({ label, value, className = '' }) {
  const display = value || '-'
  return (
    <div className={className}>
      <label className={labelCls}>{label}</label>
      <div className={valueCls}>{display}</div>
    </div>
  )
}

function DocLink({ path, label }) {
  if (!path) return <span className="text-zinc-400 text-xs">No file</span>
  return (
    <a
      href={path}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline hover:text-blue-800 text-xs"
    >
      {label}
    </a>
  )
}

function TableSection({ title, data, columns }) {
  if (!data || data.length === 0) return null
  return (
    <div className="mt-4 overflow-x-auto">
      <h4 className="mb-2 text-sm font-semibold text-zinc-700">{title}</h4>
      <table className="w-full text-sm border rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-zinc-100 text-left text-xs font-semibold uppercase text-zinc-500">
            {columns.map((col) => (
              <th key={col.key} className="px-3 py-2">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t hover:bg-zinc-50">
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-2 text-zinc-700">
                  {col.render ? col.render(row[col.key]) : row[col.key] || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatDate(val) {
  if (!val) return '-'
  const d = new Date(val)
  if (isNaN(d.getTime())) return val
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function ViewContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      setError('No report ID provided')
      setLoading(false)
      return
    }
    fetch(`/api/report?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.report) {
          setReport(data.report)
        } else {
          setError('Report not found')
        }
      })
      .catch(() => setError('Failed to load report'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex min-h-screen items-center justify-center text-zinc-500">Loading...</div>
  if (error) return <div className="flex min-h-screen items-center justify-center text-red-500">{error}</div>
  if (!report) return null

  const r = report

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-800">Course Report View</h1>
          <div className="flex gap-3">
            <a
              href={`/add-entry?id=${r._id}`}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
              Edit
            </a>
            <Link href="/" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
              &larr; Back
            </Link>
          </div>
        </div>

        {/* ── 1. Course Information & Personal Profile ── */}
        <section className="mb-8">
          <h2 className={sectionTitleCls}>1. Course Information &amp; Personal Profile</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Course Name / अध्ययन" value={r.courseName} />
            <Field label="Serial No / क्रम संख्या" value={r.serialNo} />
            <Field label="From Date / प्रारम्भ" value={formatDate(r.fromDate)} />
            <Field label="To Date / समाप्ति" value={formatDate(r.toDate)} />
            <Field label="IC No" value={r.icNo} />
            <Field label="Rank / पद" value={r.rank} />
            <Field label="Name / नाम" value={r.name} />
            <Field label="Unit / यूनिट" value={r.unit} />
            <Field label="Corps / कोर" value={r.corps} />
          </div>
        </section>

        {/* ── 2. Service & Personal Details ── */}
        <section className="mb-8">
          <h2 className={sectionTitleCls}>2. Service &amp; Personal Details</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Formation / फार्मेशन" value={r.formation} />
            <Field label="Command / कमान" value={r.command} />
            <Field label="Appt (Cmp Unit) / पद" value={r.apptCmpUnit} />
            <Field label="Regt / Corps" value={r.regtCrops} />
            <Field label="Date of Commission" value={formatDate(r.dateOfCommission)} />
            <Field label="Date of Seniority" value={formatDate(r.dateOfSeniority)} />
            <Field label="Date of Sub Ranks" value={formatDate(r.dateOfSubRanks)} />
            <Field label="Date of Superannuation" value={formatDate(r.dateOfSuperannuation)} />
            <Field label="Concerned MS" value={r.concernedMS} />
            <Field label="Date of Birth" value={formatDate(r.dateOfBirth)} />
            <Field label="Age" value={r.age} />
            <Field label="Date of Marriage" value={formatDate(r.dateOfMarriage)} />
            <Field label="Date of TOS" value={formatDate(r.dateOfTOS)} />
            <Field label="Date of TORS" value={formatDate(r.dateOfTORS)} />
            <Field label="Tenure at CMP" value={r.tenureCMP} />
            <Field label="Arrival Date to CCW" value={formatDate(r.arrivalDateCCW)} />
            <Field label="Height (in CM)" value={r.height} />
            <Field label="Weight (in KG)" value={r.weight} />
            <Field label="BMI" value={r.bmi} />
            <Field label="Medical Category" value={r.medicalCategory} />
            <Field label="Diagnosis" value={r.diagnosis} />
            <Field label="I-Card No" value={r.iCardNo} />
            <Field label="Warrant Card No" value={r.warrantCardNo} />
            <Field label="PAN Card No" value={r.panCardNo} />
            <Field label="Aadhaar Card No" value={r.aadhaarCardNo} />
            <Field label="Passport No" value={r.passportNo} />
            <Field label="CDA (O) Acct No" value={r.cdaAcctNo} />
            <Field label="Mob No" value={r.mobNo} />
            <Field label="Email Id" value={r.emailId} />
            <Field label="Religion" value={r.religion} />
            <Field label="Blood Group" value={r.bloodGroup} />
            <Field label="Basic Pay" value={r.basicPay} />
          </div>

          <TableSection
            title="Civil Qualification"
            data={r.civilQualification}
            columns={[
              { key: 'srNo', label: 'Sr No' },
              { key: 'qualification', label: 'Qualification' },
              { key: 'boardUniversity', label: 'Board / University' },
              { key: 'passingYear', label: 'Passing Year' },
              { key: 'grading', label: 'Grading' },
            ]}
          />
          <TableSection
            title="Military Education"
            data={r.militaryEducation}
            columns={[
              { key: 'srNo', label: 'Sr No' },
              { key: 'nomenclature', label: 'Nomenclature' },
              { key: 'institute', label: 'Institute' },
              { key: 'year', label: 'Year' },
              { key: 'gradingStd', label: 'Grading / Std' },
            ]}
          />
          <TableSection
            title="Instructional / Staff Appt Records"
            data={r.instrStaffAppt}
            columns={[
              { key: 'srNo', label: 'Sr No' },
              { key: 'typeOfInstrAppointment', label: 'Type of Instr Appointment' },
              { key: 'institute', label: 'Institute' },
              { key: 'duration', label: 'Duration' },
            ]}
          />
          <TableSection
            title="Posting Record (Peace / Field)"
            data={r.postingRecord}
            columns={[
              { key: 'srNo', label: 'Sr No' },
              { key: 'unitName', label: 'Unit Name' },
              { key: 'typeOfUnit', label: 'Type of Unit' },
              { key: 'duration', label: 'Duration' },
              { key: 'specialAchievement', label: 'Special Achievement' },
            ]}
          />
          <TableSection
            title="Family Details"
            data={r.familyDetails}
            columns={[
              { key: 'srNo', label: 'Sr' },
              { key: 'name', label: 'Name' },
              { key: 'relation', label: 'Relation' },
              { key: 'dob', label: 'DoB', render: formatDate },
              { key: 'education', label: 'Education' },
              { key: 'occupation', label: 'Occupation' },
            ]}
          />
        </section>

        {/* ── 3. Documents & Clearances ── */}
        <section className="mb-8">
          <h2 className={sectionTitleCls}>3. Documents &amp; Clearances</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-zinc-100 text-left text-xs font-semibold uppercase text-zinc-500">
                  <th className="px-3 py-2">Document</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Uploaded File</th>
                  <th className="px-3 py-2">Points</th>
                </tr>
              </thead>
              <tbody>
                {DOC_FIELDS.map(([label, key, docKey, pointsKey]) => (
                  <tr key={key} className="border-t hover:bg-zinc-50">
                    <td className="px-3 py-2 font-medium text-zinc-700">{label}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${r[key] === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                        {r[key] || 'No'}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {r[docKey] ? (
                        <DocLink path={r[docKey]} label="View Document" />
                      ) : (
                        <span className="text-zinc-400 text-xs">No file</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-zinc-700">{pointsKey ? (r[pointsKey] || '-') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Food Preference / भोजन" value={r.foodPreference} />
            <Field label="Departure Date" value={formatDate(r.departureDate)} />
            <Field label="Date of SORS" value={formatDate(r.dateOfSORS)} />
            <Field label="Jain University Ser No" value={r.jainUniversitySerNo} />
          </div>
        </section>

        {/* ── 4. Theory ── */}
        <section className="mb-8">
          <h2 className={sectionTitleCls}>4. Result (Theory)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-zinc-100 text-left text-xs font-semibold uppercase text-zinc-500">
                  <th className="px-3 py-2">Subject</th>
                  <th className="px-3 py-2">Max</th>
                  <th className="px-3 py-2">Obtained</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Entrance', 'entrance', 15],
                  ['Law Enforcement', 'lawEnforcementTheory', 80],
                  ['Traffic Management', 'trafficManagementTheory', 80],
                  ['Investigation', 'investigationTheory', 80],
                  ['Law', 'lawTheory', 45],
                ].map(([label, key, max]) => (
                  <tr key={key} className="border-t hover:bg-zinc-50">
                    <td className="px-3 py-2 font-medium text-zinc-700">{label}</td>
                    <td className="px-3 py-2 text-zinc-600">{max}</td>
                    <td className="px-3 py-2 text-zinc-800 font-medium">{r[key] ?? '-'}</td>
                  </tr>
                ))}
                <tr className="border-t bg-blue-50 font-semibold">
                  <td className="px-3 py-2 text-blue-800">Total</td>
                  <td className="px-3 py-2 text-blue-600">300</td>
                  <td className="px-3 py-2 text-blue-800">{r.totalTheory ?? '-'}</td>
                </tr>
                <tr className="border-t bg-green-50 font-semibold">
                  <td className="px-3 py-2 text-green-800">Percentage</td>
                  <td className="px-3 py-2 text-green-600">100%</td>
                  <td className="px-3 py-2 text-green-800">{r.theoryPercentage != null ? `${r.theoryPercentage}%` : '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 5. Trg Ex & Misc ── */}
        <section className="mb-8">
          <h2 className={sectionTitleCls}>5. Result (Trg Ex &amp; Misc Assessment)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-zinc-100 text-left text-xs font-semibold uppercase text-zinc-500">
                  <th className="px-3 py-2">Subject</th>
                  <th className="px-3 py-2">Max</th>
                  <th className="px-3 py-2">Obtained</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Ex-Anushashan', 'exAnushashan', 25],
                  ['Ex-Kabu', 'exKabu', 25],
                  ['Ex-Nandi', 'exNandi', 30],
                  ['Ex-Maru Vijay', 'exMaruVijay', 20],
                  ['Ex-Khoj', 'exKhoj', 50],
                  ['Case Study', 'caseStudyTrg', 40],
                  ['(g)', 'misc20', 20],
                  ['Military Paper', 'militaryPaperTrg', 40],
                ].map(([label, key, max]) => (
                  <tr key={key} className="border-t hover:bg-zinc-50">
                    <td className="px-3 py-2 font-medium text-zinc-700">{label}</td>
                    <td className="px-3 py-2 text-zinc-600">{max}</td>
                    <td className="px-3 py-2 text-zinc-800 font-medium">{r[key] ?? '-'}</td>
                  </tr>
                ))}
                <tr className="border-t bg-blue-50 font-semibold">
                  <td className="px-3 py-2 text-blue-800">Total</td>
                  <td className="px-3 py-2 text-blue-600">250</td>
                  <td className="px-3 py-2 text-blue-800">{r.totalTrgEx ?? '-'}</td>
                </tr>
                <tr className="border-t bg-green-50 font-semibold">
                  <td className="px-3 py-2 text-green-800">Percentage</td>
                  <td className="px-3 py-2 text-green-600">100%</td>
                  <td className="px-3 py-2 text-green-800">{r.trgExPercentage != null ? `${r.trgExPercentage}%` : '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 6. DS Assessment ── */}
        <section className="mb-8">
          <h2 className={sectionTitleCls}>6. DS Assessment</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-zinc-100 text-left text-xs font-semibold uppercase text-zinc-500">
                  <th className="px-3 py-2">Subject</th>
                  <th className="px-3 py-2">Max</th>
                  <th className="px-3 py-2">Obtained</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['DS II', 'dsII', 10],
                  ['DS I', 'dsI', 10],
                  ['OC CCW', 'ocCCW', 10],
                  ['DCCI', 'dcci', 10],
                  ['Commandant', 'commandant', 10],
                ].map(([label, key, max]) => (
                  <tr key={key} className="border-t hover:bg-zinc-50">
                    <td className="px-3 py-2 font-medium text-zinc-700">{label}</td>
                    <td className="px-3 py-2 text-zinc-600">{max}</td>
                    <td className="px-3 py-2 text-zinc-800 font-medium">{r[key] ?? '-'}</td>
                  </tr>
                ))}
                <tr className="border-t bg-blue-50 font-semibold">
                  <td className="px-3 py-2 text-blue-800">Total</td>
                  <td className="px-3 py-2 text-blue-600">50</td>
                  <td className="px-3 py-2 text-blue-800">{r.totalDS ?? '-'}</td>
                </tr>
                <tr className="border-t bg-green-50 font-semibold">
                  <td className="px-3 py-2 text-green-800">Percentage</td>
                  <td className="px-3 py-2 text-green-600">100%</td>
                  <td className="px-3 py-2 text-green-800">{r.dsPercentage != null ? `${r.dsPercentage}%` : '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 7. Over All Result ── */}
        <section className="mb-8">
          <h2 className={sectionTitleCls}>7. Over All Result</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-zinc-100 text-left text-xs font-semibold uppercase text-zinc-500">
                  <th className="px-3 py-2">Component</th>
                  <th className="px-3 py-2">Max</th>
                  <th className="px-3 py-2">Obtained</th>
                  <th className="px-3 py-2">Percentage</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t hover:bg-zinc-50">
                  <td className="px-3 py-2 font-medium text-zinc-700">Result (Theory)</td>
                  <td className="px-3 py-2 text-zinc-600">300</td>
                  <td className="px-3 py-2 text-zinc-800">{r.totalTheory ?? '-'}</td>
                  <td className="px-3 py-2 text-zinc-800">{r.theoryPercentage != null ? `${r.theoryPercentage}%` : '-'}</td>
                </tr>
                <tr className="border-t hover:bg-zinc-50">
                  <td className="px-3 py-2 font-medium text-zinc-700">Result (Trg Ex & Misc)</td>
                  <td className="px-3 py-2 text-zinc-600">250</td>
                  <td className="px-3 py-2 text-zinc-800">{r.totalTrgEx ?? '-'}</td>
                  <td className="px-3 py-2 text-zinc-800">{r.trgExPercentage != null ? `${r.trgExPercentage}%` : '-'}</td>
                </tr>
                <tr className="border-t hover:bg-zinc-50">
                  <td className="px-3 py-2 font-medium text-zinc-700">DS Assessment</td>
                  <td className="px-3 py-2 text-zinc-600">50</td>
                  <td className="px-3 py-2 text-zinc-800">{r.totalDS ?? '-'}</td>
                  <td className="px-3 py-2 text-zinc-800">{r.dsPercentage != null ? `${r.dsPercentage}%` : '-'}</td>
                </tr>
                <tr className="border-t bg-blue-50 font-semibold">
                  <td className="px-3 py-2 text-blue-800">Total</td>
                  <td className="px-3 py-2 text-blue-600">600</td>
                  <td className="px-3 py-2 text-blue-800">{r.totalOverall ?? '-'}</td>
                  <td className="px-3 py-2 text-blue-800">{r.overallPercentage != null ? `${r.overallPercentage}%` : '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Grading / दर्जा" value={r.grading} />
            <Field label="ज्ञान / Knowledge" value={r.knowledge} />
            <Field label="उपयोग / Application" value={r.application} />
            <Field label="कोर्स चिन्ह / Course Symbol" value={r.courseSymbol} />
          </div>
          <div className="mt-4">
            <label className={labelCls}>संक्षिप्तवर्णन / Pen Picture</label>
            <div
              className="prose prose-sm mt-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-800"
              dangerouslySetInnerHTML={{ __html: r.penPicture || '-' }}
            />
          </div>
          <div className="mt-4">
            <Field label="अनुदेशण क्षमता / Instructional Ability" value={r.instructionalAbility} />
          </div>
        </section>

        {/* ── 8. Signing Authority ── */}
        <section className="mb-8">
          <h2 className={sectionTitleCls}>8. Signing Authority</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="नं / No (Report No)" value={r.reportNo} />
            <Field label="Authority Rank / पद" value={r.authorityRank} />
            <Field label="Authority Name" value={r.authorityName} />
            <Field label="स्थान / Station" value={r.station} />
            <Field label="कमांडेंट / Authority Title" value={r.authorityTitle} />
            <Field label="दिनाँक / Date" value={formatDate(r.reportDate)} />
            <div className="sm:col-span-2 lg:col-span-3">
              <Field label="Organization (Hindi)" value={r.orgNameHindi} />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <Field label="Organization (English)" value={r.orgNameEnglish} />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default function ViewPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-zinc-500">Loading...</div>}>
      <ViewContent />
    </Suspense>
  )
}
