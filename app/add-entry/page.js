'use client'

import { useMemo, useState } from 'react'

const inputCls =
  'w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
const labelCls = 'mb-1 block text-sm font-medium text-zinc-700'

export default function AddEntry() {
  const [form, setForm] = useState({
    courseName: '',
    serialNo: '',
    fromDate: '',
    toDate: '',
    icNo: '',
    rank: '',
    name: '',
    unit: '',
    corps: '',
    formation: '',
    command: '',
    apptCmpUnit: '',
    regtCrops: '',
    dateOfCommission: '',
    dateOfSeniority: '',
    dateOfSubRanks: '',
    dateOfSuperannuation: '',
    concernedMS: '',
    dateOfBirth: '',
    age: '',
    dateOfMarriage: '',
    dateOfTOS: '',
    dateOfTORS: '',
    tenureCMP: '',
    arrivalDateCCW: '',
    foodPreference: 'Veg',
    admInfo: 'No',
    admInfoDoc: '',
    movementOrder: 'No',
    movementOrderDoc: '',
    lrc: 'No',
    lrcDoc: '',
    willingnessCert: 'No',
    willingnessCertDoc: '',
    medicalCert: 'No',
    medicalCertDoc: '',
    nominalRoll: 'No',
    nominalRollDoc: '',
    etg: 'No',
    etgDoc: '',
    cyberSecurityCert: 'No',
    cyberSecurityCertDoc: '',
    appxFAO: 'No',
    appxFAODoc: '',
    teiFeedback: 'No',
    teiFeedbackDoc: '',
    teiFeedbackPoints: '',
    admFeedback: 'No',
    admFeedbackDoc: '',
    admFeedbackPoints: '',
    mutualAssessment: 'No',
    mutualAssessmentDoc: '',
    withFamily: 'No',
    withFamilyDoc: '',
    departureDate: '',
    dateOfSORS: '',
    jainUniversitySerNo: '',
    entrance: '',
    lawEnforcementTheory: '',
    trafficManagementTheory: '',
    investigationTheory: '',
    lawTheory: '',
    totalTheory: 0,
    theoryPercentage: 0,
    exAnushashan: '',
    exKabu: '',
    exNandi: '',
    exMaruVijay: '',
    exKhoj: '',
    caseStudyTrg: '',
    misc20: '',
    militaryPaperTrg: '',
    totalTrgEx: 0,
    trgExPercentage: 0,
    dsII: '',
    dsI: '',
    ocCCW: '',
    dcci: '',
    commandant: '',
    totalDS: 0,
    dsPercentage: 0,
    height: '',
    weight: '',
    bmi: '',
    medicalCategory: '',
    diagnosis: '',
    iCardNo: '',
    warrantCardNo: '',
    panCardNo: '',
    aadhaarCardNo: '',
    passportNo: '',
    cdaAcctNo: '',
    mobNo: '',
    emailId: '',
    religion: '',
    bloodGroup: '',
    basicPay: '',
    civilQualification: [],
    militaryEducation: [],
    instrStaffAppt: [],
    postingRecord: [],
    familyDetails: [],
    courseSymbol: '',
    penPicture: '',
    orderOfMerit: '',
    totalOfficers: '',
    grading: 'Q',
    remarks: '',
  })
  const [files, setFiles] = useState({})
  const [loading, setLoading] = useState(false)

  const theoryResults = useMemo(() => {
    const t = (
      (parseFloat(form.entrance) || 0) +
      (parseFloat(form.lawEnforcementTheory) || 0) +
      (parseFloat(form.trafficManagementTheory) || 0) +
      (parseFloat(form.investigationTheory) || 0) +
      (parseFloat(form.lawTheory) || 0)
    )
    const p = 300 > 0 ? ((t / 300) * 100).toFixed(2) : 0
    return { totalTheory: t, theoryPercentage: p }
  }, [form.entrance, form.lawEnforcementTheory, form.trafficManagementTheory, form.investigationTheory, form.lawTheory])

  const trgExResults = useMemo(() => {
    const t = (
      (parseFloat(form.exAnushashan) || 0) +
      (parseFloat(form.exKabu) || 0) +
      (parseFloat(form.exNandi) || 0) +
      (parseFloat(form.exMaruVijay) || 0) +
      (parseFloat(form.exKhoj) || 0) +
      (parseFloat(form.caseStudyTrg) || 0) +
      (parseFloat(form.misc20) || 0) +
      (parseFloat(form.militaryPaperTrg) || 0)
    )
    const p = 250 > 0 ? ((t / 250) * 100).toFixed(2) : 0
    return { totalTrgEx: t, trgExPercentage: p }
  }, [form.exAnushashan, form.exKabu, form.exNandi, form.exMaruVijay, form.exKhoj, form.caseStudyTrg, form.misc20, form.militaryPaperTrg])

  const dsResults = useMemo(() => {
    const t = (
      (parseFloat(form.dsII) || 0) +
      (parseFloat(form.dsI) || 0) +
      (parseFloat(form.ocCCW) || 0) +
      (parseFloat(form.dcci) || 0) +
      (parseFloat(form.commandant) || 0)
    )
    const p = 50 > 0 ? ((t / 50) * 100).toFixed(2) : 0
    return { totalDS: t, dsPercentage: p }
  }, [form.dsII, form.dsI, form.ocCCW, form.dcci, form.commandant])

  const overallResults = useMemo(() => {
    const t = theoryResults.totalTheory + trgExResults.totalTrgEx + dsResults.totalDS
    const p = 600 > 0 ? ((t / 600) * 100).toFixed(2) : 0
    return { totalOverall: t, overallPercentage: p }
  }, [theoryResults, trgExResults, dsResults])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']

  function handleFileChange(e) {
    const { name, files: fileList } = e.target
    if (fileList.length > 0) {
      const file = fileList[0]
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert('Only images (JPEG, PNG, GIF, WebP) and PDF files are allowed.')
        e.target.value = ''
        return
      }
      setFiles((prev) => ({ ...prev, [name]: file }))
    }
  }

  function handleArrayChange(key, index, field, value) {
    setForm((prev) => {
      const list = [...prev[key]]
      list[index] = { ...list[index], [field]: value }
      return { ...prev, [key]: list }
    })
  }

  function addArrayRow(key, template) {
    setForm((prev) => ({
      ...prev,
      [key]: [...prev[key], { ...template }],
    }))
  }

  function removeArrayRow(key, index) {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }))
  }

  const ARRAY_FIELDS = ['civilQualification', 'militaryEducation', 'instrStaffAppt', 'postingRecord', 'familyDetails']

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const fd = new FormData()
      const payload = { ...form, ...theoryResults, ...trgExResults, ...dsResults, ...overallResults }

      for (const [key, val] of Object.entries(payload)) {
        if (ARRAY_FIELDS.includes(key)) {
          fd.append(key, JSON.stringify(val))
        } else {
          fd.append(key, val == null ? '' : String(val))
        }
      }

      for (const [key, file] of Object.entries(files)) {
        fd.append(key, file)
      }

      const res = await fetch('/api/report', {
        method: 'POST',
        body: fd,
      })

      if (!res.ok) {
        const err = await res.json()
        alert(err.error || 'Failed to generate report')
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Report_${form.icNo || 'draft'}.docx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-8 text-2xl font-bold text-zinc-800">
          Army Course Report Generator
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* ── Section 1: Course Information & Personal Profile ── */}
          <section>
            <h2 className="mb-4 pb-2 text-lg font-semibold text-zinc-800 border-b border-zinc-200">
              1. Course Information &amp; Personal Profile
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className={labelCls}>Course Name / अध्ययन</label>
                <input
                  name="courseName"
                  value={form.courseName}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Serial No / क्रम संख्या</label>
                <input
                  name="serialNo"
                  value={form.serialNo}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>From / से</label>
                <input
                  name="fromDate"
                  type="date"
                  value={form.fromDate}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>To / तक</label>
                <input
                  name="toDate"
                  type="date"
                  value={form.toDate}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>No / नंबर (IC No)</label>
                <input
                  name="icNo"
                  value={form.icNo}
                  onChange={handleChange}
                  required
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Rank / पद</label>
                <input
                  name="rank"
                  value={form.rank}
                  onChange={handleChange}
                  required
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Name / नाम</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Unit / युनिट</label>
                <input
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  required
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Corps / कोर</label>
                <input
                  name="corps"
                  value={form.corps}
                  onChange={handleChange}
                  required
                  className={inputCls}
                />
              </div>
            </div>
          </section>

          {/* ── Section 2: Service & Personal Details ── */}
          <section>
            <h2 className="mb-4 pb-2 text-lg font-semibold text-zinc-800 border-b border-zinc-200">
              2. Service &amp; Personal Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className={labelCls}>Formation</label>
                <input
                  name="formation"
                  value={form.formation}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Command</label>
                <input
                  name="command"
                  value={form.command}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Appt in the CMP Unit</label>
                <input
                  name="apptCmpUnit"
                  value={form.apptCmpUnit}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Regt / Crops</label>
                <input
                  name="regtCrops"
                  value={form.regtCrops}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Date of Commission</label>
                <input
                  name="dateOfCommission"
                  type="date"
                  value={form.dateOfCommission}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Date of Seniority</label>
                <input
                  name="dateOfSeniority"
                  type="date"
                  value={form.dateOfSeniority}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Date of Sub Ranks</label>
                <input
                  name="dateOfSubRanks"
                  type="date"
                  value={form.dateOfSubRanks}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Date of Superannuation</label>
                <input
                  name="dateOfSuperannuation"
                  type="date"
                  value={form.dateOfSuperannuation}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Concerned MS (Branch)</label>
                <input
                  name="concernedMS"
                  value={form.concernedMS}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Date of Birth</label>
                <input
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Age (with Year &amp; Month)</label>
                <input
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Date of Marriage</label>
                <input
                  name="dateOfMarriage"
                  type="date"
                  value={form.dateOfMarriage}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Date of TOS to CMP</label>
                <input
                  name="dateOfTOS"
                  type="date"
                  value={form.dateOfTOS}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Date of TORS to CMP</label>
                <input
                  name="dateOfTORS"
                  type="date"
                  value={form.dateOfTORS}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Tenure Duration in CMP (Year &amp; Month)</label>
                <input
                  name="tenureCMP"
                  value={form.tenureCMP}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Arrival Date to CCW</label>
                <input
                  name="arrivalDateCCW"
                  type="date"
                  value={form.arrivalDateCCW}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Height (in CM)</label>
                <input
                  name="height"
                  type="number"
                  value={form.height}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Weight</label>
                <input
                  name="weight"
                  type="number"
                  value={form.weight}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>BMI</label>
                <input
                  name="bmi"
                  type="number"
                  step="0.1"
                  value={form.bmi}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Medical Category</label>
                <input
                  name="medicalCategory"
                  value={form.medicalCategory}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Diagnosis</label>
                <input
                  name="diagnosis"
                  value={form.diagnosis}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>I-Card No</label>
                <input
                  name="iCardNo"
                  value={form.iCardNo}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Warrant Card No</label>
                <input
                  name="warrantCardNo"
                  value={form.warrantCardNo}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>PAN Card No</label>
                <input
                  name="panCardNo"
                  value={form.panCardNo}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Aadhaar Card No</label>
                <input
                  name="aadhaarCardNo"
                  value={form.aadhaarCardNo}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Passport No</label>
                <input
                  name="passportNo"
                  value={form.passportNo}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>CDA (O) Acct No</label>
                <input
                  name="cdaAcctNo"
                  value={form.cdaAcctNo}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Mob No</label>
                <input
                  name="mobNo"
                  value={form.mobNo}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Email Id</label>
                <input
                  name="emailId"
                  type="email"
                  value={form.emailId}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Religion</label>
                <input
                  name="religion"
                  value={form.religion}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Blood Group</label>
                <input
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Basic Pay</label>
                <input
                  name="basicPay"
                  value={form.basicPay}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className={labelCls}>Civil Qualification</label>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-600">
                        <th className="py-1 pr-1 text-left font-medium w-12">Sr No</th>
                        <th className="py-1 px-1 text-left font-medium">Qualification</th>
                        <th className="py-1 px-1 text-left font-medium">Board / University</th>
                        <th className="py-1 px-1 text-left font-medium w-20">Passing Year</th>
                        <th className="py-1 px-1 text-left font-medium w-20">Grading</th>
                        <th className="py-1 pl-1 text-center w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.civilQualification.map((row, i) => (
                        <tr key={i} className="border-b border-zinc-100">
                          <td className="py-1 pr-1">
                            <input
                              value={row.srNo}
                              onChange={(e) => handleArrayChange('civilQualification', i, 'srNo', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              value={row.qualification}
                              onChange={(e) => handleArrayChange('civilQualification', i, 'qualification', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              value={row.boardUniversity}
                              onChange={(e) => handleArrayChange('civilQualification', i, 'boardUniversity', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              value={row.passingYear}
                              onChange={(e) => handleArrayChange('civilQualification', i, 'passingYear', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              value={row.grading}
                              onChange={(e) => handleArrayChange('civilQualification', i, 'grading', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 pl-1 text-center">
                            <button
                              type="button"
                              onClick={() => removeArrayRow('civilQualification', i)}
                              className="text-red-500 hover:text-red-700 text-lg leading-none"
                            >
                              &times;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={() => addArrayRow('civilQualification', { srNo: '', qualification: '', boardUniversity: '', passingYear: '', grading: '' })}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Qualification
                </button>
              </div>

              {/* ── Military Education ── */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className={labelCls}>Military Education</label>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-600">
                        <th className="py-1 pr-1 text-left font-medium w-12">Sr No</th>
                        <th className="py-1 px-1 text-left font-medium">Nomenclature</th>
                        <th className="py-1 px-1 text-left font-medium">Institute</th>
                        <th className="py-1 px-1 text-left font-medium w-20">Year</th>
                        <th className="py-1 px-1 text-left font-medium w-20">Grading / Std</th>
                        <th className="py-1 pl-1 text-center w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.militaryEducation.map((row, i) => (
                        <tr key={i} className="border-b border-zinc-100">
                          <td className="py-1 pr-1">
                            <input
                              value={row.srNo}
                              onChange={(e) => handleArrayChange('militaryEducation', i, 'srNo', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              value={row.nomenclature}
                              onChange={(e) => handleArrayChange('militaryEducation', i, 'nomenclature', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              value={row.institute}
                              onChange={(e) => handleArrayChange('militaryEducation', i, 'institute', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              value={row.year}
                              onChange={(e) => handleArrayChange('militaryEducation', i, 'year', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              value={row.gradingStd}
                              onChange={(e) => handleArrayChange('militaryEducation', i, 'gradingStd', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 pl-1 text-center">
                            <button
                              type="button"
                              onClick={() => removeArrayRow('militaryEducation', i)}
                              className="text-red-500 hover:text-red-700 text-lg leading-none"
                            >
                              &times;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={() => addArrayRow('militaryEducation', { srNo: '', nomenclature: '', institute: '', year: '', gradingStd: '' })}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Military Education
                </button>
              </div>

              {/* ── Instructional / Staff Appt Records ── */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className={labelCls}>Instructional / Staff Appt Records</label>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-600">
                        <th className="py-1 pr-1 text-left font-medium w-12">Sr No</th>
                        <th className="py-1 px-1 text-left font-medium">Type of Instr Appointment</th>
                        <th className="py-1 px-1 text-left font-medium">Institute</th>
                        <th className="py-1 px-1 text-left font-medium w-24">Duration</th>
                        <th className="py-1 pl-1 text-center w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.instrStaffAppt.map((row, i) => (
                        <tr key={i} className="border-b border-zinc-100">
                          <td className="py-1 pr-1">
                            <input
                              value={row.srNo}
                              onChange={(e) => handleArrayChange('instrStaffAppt', i, 'srNo', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              value={row.typeOfInstrAppointment}
                              onChange={(e) => handleArrayChange('instrStaffAppt', i, 'typeOfInstrAppointment', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              value={row.institute}
                              onChange={(e) => handleArrayChange('instrStaffAppt', i, 'institute', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              value={row.duration}
                              onChange={(e) => handleArrayChange('instrStaffAppt', i, 'duration', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 pl-1 text-center">
                            <button
                              type="button"
                              onClick={() => removeArrayRow('instrStaffAppt', i)}
                              className="text-red-500 hover:text-red-700 text-lg leading-none"
                            >
                              &times;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={() => addArrayRow('instrStaffAppt', { srNo: '', typeOfInstrAppointment: '', institute: '', duration: '' })}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Record
                </button>
              </div>

              {/* ── Posting Record (Peace/Field) ── */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className={labelCls}>Posting Record (Peace / Field)</label>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-600">
                        <th className="py-1 pr-1 text-left font-medium w-12">Sr No</th>
                        <th className="py-1 px-1 text-left font-medium">Unit Name</th>
                        <th className="py-1 px-1 text-left font-medium">Type of Unit</th>
                        <th className="py-1 px-1 text-left font-medium w-24">Duration</th>
                        <th className="py-1 px-1 text-left font-medium">Special Achievement</th>
                        <th className="py-1 pl-1 text-center w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.postingRecord.map((row, i) => (
                        <tr key={i} className="border-b border-zinc-100">
                          <td className="py-1 pr-1">
                            <input
                              value={row.srNo}
                              onChange={(e) => handleArrayChange('postingRecord', i, 'srNo', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              value={row.unitName}
                              onChange={(e) => handleArrayChange('postingRecord', i, 'unitName', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              value={row.typeOfUnit}
                              onChange={(e) => handleArrayChange('postingRecord', i, 'typeOfUnit', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              value={row.duration}
                              onChange={(e) => handleArrayChange('postingRecord', i, 'duration', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              value={row.specialAchievement}
                              onChange={(e) => handleArrayChange('postingRecord', i, 'specialAchievement', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 pl-1 text-center">
                            <button
                              type="button"
                              onClick={() => removeArrayRow('postingRecord', i)}
                              className="text-red-500 hover:text-red-700 text-lg leading-none"
                            >
                              &times;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={() => addArrayRow('postingRecord', { srNo: '', unitName: '', typeOfUnit: '', duration: '', specialAchievement: '' })}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Posting Record
                </button>
              </div>

              {/* ── Family Details ── */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className={labelCls}>Family Details</label>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-600">
                        <th className="py-1 pr-1 text-left font-medium w-12">Sr</th>
                        <th className="py-1 px-1 text-left font-medium">Name</th>
                        <th className="py-1 px-1 text-left font-medium">Relation</th>
                        <th className="py-1 px-1 text-left font-medium w-28">DoB</th>
                        <th className="py-1 px-1 text-left font-medium">Education</th>
                        <th className="py-1 px-1 text-left font-medium">Occupation</th>
                        <th className="py-1 pl-1 text-center w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.familyDetails.map((row, i) => (
                        <tr key={i} className="border-b border-zinc-100">
                          <td className="py-1 pr-1">
                            <input
                              value={row.srNo}
                              onChange={(e) => handleArrayChange('familyDetails', i, 'srNo', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              value={row.name}
                              onChange={(e) => handleArrayChange('familyDetails', i, 'name', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              value={row.relation}
                              onChange={(e) => handleArrayChange('familyDetails', i, 'relation', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              type="date"
                              value={row.dob}
                              onChange={(e) => handleArrayChange('familyDetails', i, 'dob', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              value={row.education}
                              onChange={(e) => handleArrayChange('familyDetails', i, 'education', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              value={row.occupation}
                              onChange={(e) => handleArrayChange('familyDetails', i, 'occupation', e.target.value)}
                              className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-1 pl-1 text-center">
                            <button
                              type="button"
                              onClick={() => removeArrayRow('familyDetails', i)}
                              className="text-red-500 hover:text-red-700 text-lg leading-none"
                            >
                              &times;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={() => addArrayRow('familyDetails', { srNo: '', name: '', relation: '', dob: '', education: '', occupation: '' })}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Family Member
                </button>
              </div>
            </div>
          </section>

          {/* ── Section 3: Documents & Clearances ── */}
          <section>
            <h2 className="mb-4 pb-2 text-lg font-semibold text-zinc-800 border-b border-zinc-200">
              3. Documents &amp; Clearances
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-600">
                    <th className="py-2 pr-4 text-left font-medium">Document</th>
                    <th className="py-2 px-2 text-center font-medium w-28">Yes / No</th>
                    <th className="py-2 pl-2 text-left font-medium">Upload Scanned Copy</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Adm Info', 'admInfo'],
                    ['Movement Order', 'movementOrder'],
                    ['LRC', 'lrc'],
                    ['Willingness Certificate', 'willingnessCert'],
                    ['Medical Certificate', 'medicalCert'],
                    ['Nominal Roll', 'nominalRoll'],
                    ['ETG', 'etg'],
                    ['Cyber Security Cert', 'cyberSecurityCert'],
                    ["Appx 'F' to AO 09/2011/DGMS", 'appxFAO'],
                    ['TEI Feedback', 'teiFeedback', true],
                    ['Adm Feedback', 'admFeedback', true],
                    ['Mutual Assessment', 'mutualAssessment'],
                    ['With Family', 'withFamily'],
                  ].map(([label, key, hasPoints]) => (
                    <tr key={key} className="border-b border-zinc-100">
                      <td className="py-2 pr-4 text-zinc-800">{label}</td>
                      <td className="py-2 px-2 text-center">
                        <label className="inline-flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name={key}
                            value="Yes"
                            checked={form[key] === 'Yes'}
                            onChange={handleChange}
                          />
                          Yes
                        </label>
                        <label className="inline-flex items-center gap-2 text-sm ml-3">
                          <input
                            type="radio"
                            name={key}
                            value="No"
                            checked={form[key] === 'No'}
                            onChange={handleChange}
                          />
                          No
                        </label>
                      </td>
                      <td className="py-2 pl-2">
                        {form[key] === 'Yes' && (
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="file"
                              name={`${key}Doc`}
                              accept="image/*,application/pdf"
                              onChange={handleFileChange}
                              className="text-sm text-zinc-600 file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {hasPoints && (
                              <input
                                name={`${key}Points`}
                                value={form[`${key}Points`]}
                                onChange={handleChange}
                                placeholder="Points"
                                className="w-24 rounded border border-zinc-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                              />
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className={labelCls}>Food Preference</label>
                <select
                  name="foodPreference"
                  value={form.foodPreference}
                  onChange={handleChange}
                  className={inputCls}
                >
                  <option value="Veg">Veg</option>
                  <option value="Non Veg">Non Veg</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Departure Date</label>
                <input
                  name="departureDate"
                  type="date"
                  value={form.departureDate}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Date of SORS from CCW</label>
                <input
                  name="dateOfSORS"
                  type="date"
                  value={form.dateOfSORS}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Jain University Ser Number</label>
                <input
                  name="jainUniversitySerNo"
                  value={form.jainUniversitySerNo}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>
          </section>

          {/* ── Section 4: Result (Theory) ── */}
          <section>
            <h2 className="mb-4 pb-2 text-lg font-semibold text-zinc-800 border-b border-zinc-200">
              4. Result (Theory)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-600">
                    <th className="py-2 pr-4 text-left font-medium">Subject</th>
                    <th className="py-2 px-2 text-center font-medium w-24">Max</th>
                    <th className="py-2 pl-2 text-center font-medium w-24">Obtained</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Entrance', 'entrance', 15],
                    ['Law Enforcement', 'lawEnforcementTheory', 80],
                    ['Traffic Management', 'trafficManagementTheory', 80],
                    ['Investigation', 'investigationTheory', 80],
                    ['Law', 'lawTheory', 45],
                  ].map(([label, key, maxVal]) => (
                    <tr key={key} className="border-b border-zinc-100">
                      <td className="py-2 pr-4 text-zinc-800">({key.charAt(0)}) {label}</td>
                      <td className="py-2 px-2 text-center text-zinc-600">/ {maxVal}</td>
                      <td className="py-2 pl-2">
                        <input
                          name={key}
                          type="number"
                          min={0}
                          max={maxVal}
                          value={form[key]}
                          onChange={(e) => {
                            const val = e.target.value
                            if (val === '' || (parseFloat(val) >= 0 && parseFloat(val) <= maxVal)) {
                              handleChange(e)
                            }
                          }}
                          className="w-full rounded border border-zinc-300 px-2 py-1 text-center text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50 font-semibold">
                    <td className="py-2 pr-4 text-zinc-800">Total</td>
                    <td className="py-2 px-2 text-center text-zinc-600">/ 300</td>
                    <td className="py-2 pl-2">
                      <input
                        value={theoryResults.totalTheory}
                        readOnly
                        className="w-full rounded bg-blue-100 px-2 py-1 text-center text-sm"
                      />
                    </td>
                  </tr>
                  <tr className="bg-green-50 font-semibold">
                    <td className="py-2 pr-4 text-zinc-800">Percentage</td>
                    <td className="py-2 px-2 text-center text-zinc-600">/ 100</td>
                    <td className="py-2 pl-2">
                      <input
                        value={`${theoryResults.theoryPercentage}%`}
                        readOnly
                        className="w-full rounded bg-green-100 px-2 py-1 text-center text-sm"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Section 5: Result (Trg Ex & Misc Assessment) ── */}
          <section>
            <h2 className="mb-4 pb-2 text-lg font-semibold text-zinc-800 border-b border-zinc-200">
              5. Result (Trg Ex &amp; Misc Assessment)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-600">
                    <th className="py-2 pr-4 text-left font-medium">Subject</th>
                    <th className="py-2 px-2 text-center font-medium w-24">Max</th>
                    <th className="py-2 pl-2 text-center font-medium w-24">Obtained</th>
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
                  ].map(([label, key, maxVal]) => (
                    <tr key={key} className="border-b border-zinc-100">
                      <td className="py-2 pr-4 text-zinc-800">({key.charAt(0).toUpperCase()}) {label}</td>
                      <td className="py-2 px-2 text-center text-zinc-600">/ {maxVal}</td>
                      <td className="py-2 pl-2">
                        <input
                          name={key}
                          type="number"
                          min={0}
                          max={maxVal}
                          value={form[key]}
                          onChange={(e) => {
                            const val = e.target.value
                            if (val === '' || (parseFloat(val) >= 0 && parseFloat(val) <= maxVal)) {
                              handleChange(e)
                            }
                          }}
                          className="w-full rounded border border-zinc-300 px-2 py-1 text-center text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50 font-semibold">
                    <td className="py-2 pr-4 text-zinc-800">Total</td>
                    <td className="py-2 px-2 text-center text-zinc-600">/ 250</td>
                    <td className="py-2 pl-2">
                      <input
                        value={trgExResults.totalTrgEx}
                        readOnly
                        className="w-full rounded bg-blue-100 px-2 py-1 text-center text-sm"
                      />
                    </td>
                  </tr>
                  <tr className="bg-green-50 font-semibold">
                    <td className="py-2 pr-4 text-zinc-800">Percentage</td>
                    <td className="py-2 px-2 text-center text-zinc-600">/ 100</td>
                    <td className="py-2 pl-2">
                      <input
                        value={`${trgExResults.trgExPercentage}%`}
                        readOnly
                        className="w-full rounded bg-green-100 px-2 py-1 text-center text-sm"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Section 6: DS Assessment ── */}
          <section>
            <h2 className="mb-4 pb-2 text-lg font-semibold text-zinc-800 border-b border-zinc-200">
              6. DS Assessment
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-600">
                    <th className="py-2 pr-4 text-left font-medium">Assessment</th>
                    <th className="py-2 px-2 text-center font-medium w-24">Max</th>
                    <th className="py-2 pl-2 text-center font-medium w-24">Obtained</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['DS II', 'dsII', 10],
                    ['DS I', 'dsI', 10],
                    ['OC CCW', 'ocCCW', 10],
                    ['DCCI', 'dcci', 10],
                    ['Commandant', 'commandant', 10],
                  ].map(([label, key, maxVal]) => (
                    <tr key={key} className="border-b border-zinc-100">
                      <td className="py-2 pr-4 text-zinc-800">({key.charAt(0).toUpperCase()}) {label}</td>
                      <td className="py-2 px-2 text-center text-zinc-600">/ {maxVal}</td>
                      <td className="py-2 pl-2">
                        <input
                          name={key}
                          type="number"
                          min={0}
                          max={maxVal}
                          value={form[key]}
                          onChange={(e) => {
                            const val = e.target.value
                            if (val === '' || (parseFloat(val) >= 0 && parseFloat(val) <= maxVal)) {
                              handleChange(e)
                            }
                          }}
                          className="w-full rounded border border-zinc-300 px-2 py-1 text-center text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50 font-semibold">
                    <td className="py-2 pr-4 text-zinc-800">Total</td>
                    <td className="py-2 px-2 text-center text-zinc-600">/ 50</td>
                    <td className="py-2 pl-2">
                      <input
                        value={dsResults.totalDS}
                        readOnly
                        className="w-full rounded bg-blue-100 px-2 py-1 text-center text-sm"
                      />
                    </td>
                  </tr>
                  <tr className="bg-green-50 font-semibold">
                    <td className="py-2 pr-4 text-zinc-800">Percentage</td>
                    <td className="py-2 px-2 text-center text-zinc-600">/ 100</td>
                    <td className="py-2 pl-2">
                      <input
                        value={`${dsResults.dsPercentage}%`}
                        readOnly
                        className="w-full rounded bg-green-100 px-2 py-1 text-center text-sm"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Section 7: Over All Result ── */}
          <section>
            <h2 className="mb-4 pb-2 text-lg font-semibold text-zinc-800 border-b border-zinc-200">
              7. Over All Result
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-600">
                    <th className="py-2 pr-4 text-left font-medium">Component</th>
                    <th className="py-2 px-2 text-center font-medium w-24">Max</th>
                    <th className="py-2 pl-2 text-center font-medium w-24">Obtained</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-100">
                    <td className="py-2 pr-4 text-zinc-800">Result (Theory)</td>
                    <td className="py-2 px-2 text-center text-zinc-600">/ 300</td>
                    <td className="py-2 pl-2">
                      <input
                        value={theoryResults.totalTheory}
                        readOnly
                        className="w-full rounded bg-zinc-100 px-2 py-1 text-center text-sm"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="py-2 pr-4 text-zinc-800">Result (Trg Ex &amp; Misc)</td>
                    <td className="py-2 px-2 text-center text-zinc-600">/ 250</td>
                    <td className="py-2 pl-2">
                      <input
                        value={trgExResults.totalTrgEx}
                        readOnly
                        className="w-full rounded bg-zinc-100 px-2 py-1 text-center text-sm"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="py-2 pr-4 text-zinc-800">DS Assessment</td>
                    <td className="py-2 px-2 text-center text-zinc-600">/ 50</td>
                    <td className="py-2 pl-2">
                      <input
                        value={dsResults.totalDS}
                        readOnly
                        className="w-full rounded bg-zinc-100 px-2 py-1 text-center text-sm"
                      />
                    </td>
                  </tr>
                  <tr className="bg-blue-50 font-semibold">
                    <td className="py-2 pr-4 text-zinc-800">Total</td>
                    <td className="py-2 px-2 text-center text-zinc-600">/ 600</td>
                    <td className="py-2 pl-2">
                      <input
                        value={overallResults.totalOverall}
                        readOnly
                        className="w-full rounded bg-blue-100 px-2 py-1 text-center text-sm"
                      />
                    </td>
                  </tr>
                  <tr className="bg-green-50 font-semibold">
                    <td className="py-2 pr-4 text-zinc-800">Percentage</td>
                    <td className="py-2 px-2 text-center text-zinc-600">/ 100</td>
                    <td className="py-2 pl-2">
                      <input
                        value={`${overallResults.overallPercentage}%`}
                        readOnly
                        className="w-full rounded bg-green-100 px-2 py-1 text-center text-sm"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <label className={labelCls}>Grading / दर्जा</label>
              <input
                name="grading"
                value={form.grading}
                onChange={handleChange}
                className={`${inputCls} max-w-[120px]`}
              />
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </form>
      </div>
    </div>
  )
}
