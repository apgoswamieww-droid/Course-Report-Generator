'use client'

import { useMemo, useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false })

const inputCls =
  'w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
const labelCls = 'mb-1 block text-sm font-medium text-zinc-700'

function toDateObj(raw) {
  if (!raw) return undefined
  if (typeof raw === 'string') {
    if (raw.includes('T')) return new Date(raw)
    const parts = raw.split('-')
    if (parts.length === 3) return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
  }
  const d = new Date(raw)
  return isNaN(d.getTime()) ? undefined : d
}

function DateInput({ name, value, onChange }) {
  const inputRef = useRef(null)
  const fpRef = useRef(null)

  useEffect(() => {
    if (!inputRef.current || fpRef.current) return
    fpRef.current = flatpickr(inputRef.current, {
      dateFormat: 'd/m/Y',
      allowInput: true,
      defaultDate: toDateObj(value),
      onChange: ([date]) => {
        if (!date) {
          onChange({ target: { name, value: '' } })
          return
        }
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        onChange({ target: { name, value: `${y}-${m}-${d}` } })
      },
    })
    return () => { fpRef.current?.destroy(); fpRef.current = null }
  }, [name, onChange]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!fpRef.current) return
    const date = toDateObj(value)
    if (date) {
      fpRef.current.setDate(date, false)
    } else {
      fpRef.current.clear(false)
    }
  }, [value])

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="DD/MM/YYYY"
      className={inputCls}
      autoComplete="off"
    />
  )
}

const STORAGE_KEY = 'add-entry-form'

const INITIAL_FORM_STATE = {
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
  knowledge: '',
  application: '',
  penPicture: '',
  courseSymbol: '',
  instructionalAbility: '',
  orderOfMerit: '',
  totalOfficers: '',
  grading: 'Q',
  remarks: '',
  authorityName: '',
  reportNo: '',
  authorityRank: '',
  station: '',
  authorityTitle: '',
  reportDate: '',
  orgNameHindi: '',
  orgNameEnglish: '',
}

const ARRAY_FIELDS = ['civilQualification', 'militaryEducation', 'instrStaffAppt', 'postingRecord', 'familyDetails']

const TOTAL_STEPS = 8

const STEP_FIELDS = [
  ['courseName', 'serialNo', 'fromDate', 'toDate', 'icNo', 'rank', 'name', 'unit', 'corps'],
  ['formation', 'command', 'apptCmpUnit', 'regtCrops', 'dateOfCommission', 'dateOfSeniority', 'dateOfSubRanks', 'dateOfSuperannuation', 'concernedMS', 'dateOfBirth', 'age', 'dateOfMarriage', 'dateOfTOS', 'dateOfTORS', 'tenureCMP', 'arrivalDateCCW', 'height', 'weight', 'bmi', 'medicalCategory', 'diagnosis', 'iCardNo', 'warrantCardNo', 'panCardNo', 'aadhaarCardNo', 'passportNo', 'cdaAcctNo', 'mobNo', 'emailId', 'religion', 'bloodGroup', 'basicPay', 'civilQualification', 'militaryEducation', 'instrStaffAppt', 'postingRecord', 'familyDetails'],
  ['foodPreference', 'admInfo', 'admInfoDoc', 'movementOrder', 'movementOrderDoc', 'lrc', 'lrcDoc', 'willingnessCert', 'willingnessCertDoc', 'medicalCert', 'medicalCertDoc', 'nominalRoll', 'nominalRollDoc', 'etg', 'etgDoc', 'cyberSecurityCert', 'cyberSecurityCertDoc', 'appxFAO', 'appxFAODoc', 'teiFeedback', 'teiFeedbackDoc', 'teiFeedbackPoints', 'admFeedback', 'admFeedbackDoc', 'admFeedbackPoints', 'mutualAssessment', 'mutualAssessmentDoc', 'withFamily', 'withFamilyDoc', 'departureDate', 'dateOfSORS', 'jainUniversitySerNo'],
  ['entrance', 'lawEnforcementTheory', 'trafficManagementTheory', 'investigationTheory', 'lawTheory'],
  ['exAnushashan', 'exKabu', 'exNandi', 'exMaruVijay', 'exKhoj', 'caseStudyTrg', 'misc20', 'militaryPaperTrg'],
  ['dsII', 'dsI', 'ocCCW', 'dcci', 'commandant'],
  ['grading', 'knowledge', 'application', 'penPicture', 'courseSymbol', 'instructionalAbility'],
  ['reportNo', 'authorityRank', 'authorityName', 'station', 'authorityTitle', 'reportDate', 'orgNameHindi', 'orgNameEnglish'],
]

function AddEntryForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(INITIAL_FORM_STATE)
  const [files, setFiles] = useState({})
  const [loading, setLoading] = useState(false)

  function sanitizeForm(obj) {
    const dateFields = new Set(['fromDate','toDate','dateOfCommission','dateOfSeniority','dateOfSubRanks','dateOfSuperannuation','dateOfBirth','dateOfMarriage','dateOfTOS','dateOfTORS','arrivalDateCCW','departureDate','dateOfSORS'])
    const out = {}
    for (const [key, val] of Object.entries(obj)) {
      if (Array.isArray(val)) {
        out[key] = val
      } else if (dateFields.has(key) && typeof val === 'string') {
        const d = new Date(val)
        if (!isNaN(d.getTime())) {
          const y = d.getFullYear()
          const m = String(d.getMonth() + 1).padStart(2, '0')
          const day = String(d.getDate()).padStart(2, '0')
          out[key] = `${y}-${m}-${day}`
        } else {
          out[key] = ''
        }
      } else {
        out[key] = val ?? ''
      }
    }
    return out
  }

  useEffect(() => {
    if (editId) {
      fetch(`/api/report?id=${editId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.report) {
            const { _id, createdAt, updatedAt, __v, ...rest } = data.report
            const clean = sanitizeForm(rest)
            setForm((prev) => ({ ...prev, ...clean }))
            localStorage.setItem(STORAGE_KEY, JSON.stringify(clean))
          }
        })
        .catch(() => {})
      return
    }
    localStorage.removeItem(STORAGE_KEY)
    setForm(INITIAL_FORM_STATE)
  }, [editId])

  const persistForm = useCallback(
    (updater) => {
      setForm((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch {
          /* ignore */
        }
        return next
      })
    },
    [],
  )

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target
      persistForm((prev) => ({ ...prev, [name]: value }))
    },
    [persistForm],
  )

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
    persistForm((prev) => {
      const list = [...prev[key]]
      list[index] = { ...list[index], [field]: value }
      return { ...prev, [key]: list }
    })
  }

  function addArrayRow(key, template) {
    persistForm((prev) => ({
      ...prev,
      [key]: [...prev[key], { ...template, srNo: String(prev[key].length + 1) }],
    }))
  }

  function removeArrayRow(key, index) {
    persistForm((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }))
  }

  const theoryResults = useMemo(() => {
    const t =
      (parseFloat(form.entrance) || 0) +
      (parseFloat(form.lawEnforcementTheory) || 0) +
      (parseFloat(form.trafficManagementTheory) || 0) +
      (parseFloat(form.investigationTheory) || 0) +
      (parseFloat(form.lawTheory) || 0)
    const p = 300 > 0 ? ((t / 300) * 100).toFixed(2) : 0
    return { totalTheory: t, theoryPercentage: p }
  }, [form.entrance, form.lawEnforcementTheory, form.trafficManagementTheory, form.investigationTheory, form.lawTheory])

  const trgExResults = useMemo(() => {
    const t =
      (parseFloat(form.exAnushashan) || 0) +
      (parseFloat(form.exKabu) || 0) +
      (parseFloat(form.exNandi) || 0) +
      (parseFloat(form.exMaruVijay) || 0) +
      (parseFloat(form.exKhoj) || 0) +
      (parseFloat(form.caseStudyTrg) || 0) +
      (parseFloat(form.misc20) || 0) +
      (parseFloat(form.militaryPaperTrg) || 0)
    const p = 250 > 0 ? ((t / 250) * 100).toFixed(2) : 0
    return { totalTrgEx: t, trgExPercentage: p }
  }, [
    form.exAnushashan,
    form.exKabu,
    form.exNandi,
    form.exMaruVijay,
    form.exKhoj,
    form.caseStudyTrg,
    form.misc20,
    form.militaryPaperTrg,
  ])

  const dsResults = useMemo(() => {
    const t =
      (parseFloat(form.dsII) || 0) +
      (parseFloat(form.dsI) || 0) +
      (parseFloat(form.ocCCW) || 0) +
      (parseFloat(form.dcci) || 0) +
      (parseFloat(form.commandant) || 0)
    const p = 50 > 0 ? ((t / 50) * 100).toFixed(2) : 0
    return { totalDS: t, dsPercentage: p }
  }, [form.dsII, form.dsI, form.ocCCW, form.dcci, form.commandant])

  const overallResults = useMemo(() => {
    const t = theoryResults.totalTheory + trgExResults.totalTrgEx + dsResults.totalDS
    const p = 600 > 0 ? ((t / 600) * 100).toFixed(2) : 0
    return { totalOverall: t, overallPercentage: p }
  }, [theoryResults, trgExResults, dsResults])

  useEffect(() => {
    if (!form.dateOfBirth) return
    const parts = form.dateOfBirth.split('-')
    if (parts.length !== 3) return
    const dob = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
    if (isNaN(dob.getTime())) return
    const now = new Date()
    let years = now.getFullYear() - dob.getFullYear()
    let months = now.getMonth() - dob.getMonth()
    if (months < 0) { years--; months += 12 }
    const ageStr = `${years} years ${months} months`
    setForm((prev) => {
      if (prev.age === ageStr) return prev
      const next = { ...prev, age: ageStr }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [form.dateOfBirth])

  useEffect(() => {
    const h = parseFloat(form.height)
    const w = parseFloat(form.weight)
    if (!h || !w) return
    const bmi = (w / ((h / 100) * (h / 100))).toFixed(1)
    setForm((prev) => {
      if (prev.bmi === bmi) return prev
      const next = { ...prev, bmi }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [form.height, form.weight])

  useEffect(() => {
    const tp = parseFloat(theoryResults.theoryPercentage)
    const tep = parseFloat(trgExResults.trgExPercentage)
    const dp = parseFloat(dsResults.dsPercentage)
    const op = parseFloat(overallResults.overallPercentage)
    if (isNaN(tp) || isNaN(tep) || isNaN(dp) || isNaN(op)) return
    let grade
    if (tp >= 65 && tep >= 65 && dp >= 65 && op >= 70) {
      grade = 'QI'
    } else if (tp >= 40 && tep >= 40 && op >= 40) {
      grade = 'Q'
    } else {
      grade = 'FAIL'
    }
    setForm((prev) => {
      if (prev.grading === grade) return prev
      const next = { ...prev, grading: grade }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [theoryResults.theoryPercentage, trgExResults.trgExPercentage, dsResults.dsPercentage, overallResults.overallPercentage])

  function prevStep() {
    setStep((s) => Math.max(0, s - 1))
  }

  function nextStep() {
    setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1))
  }

  function resetStep() {
    const fields = STEP_FIELDS[step]
    persistForm((prev) => {
      const next = { ...prev }
      for (const field of fields) {
        if (Array.isArray(INITIAL_FORM_STATE[field])) {
          next[field] = []
        } else {
          next[field] = INITIAL_FORM_STATE[field]
        }
      }
      return next
    })
    setFiles((prev) => {
      const next = { ...prev }
      for (const field of fields) {
        if (field.endsWith('Doc')) delete next[field]
      }
      return next
    })
  }

  const [updating, setUpdating] = useState(false)

  async function handleSectionUpdate() {
    setUpdating(true)
    try {
      const fields = [...STEP_FIELDS[step]]
      if (step === 3) fields.push('totalTheory', 'theoryPercentage')
      if (step === 4) fields.push('totalTrgEx', 'trgExPercentage')
      if (step === 5) fields.push('totalDS', 'dsPercentage')
      if (step === 6) fields.push('totalOverall', 'overallPercentage')

      const payload = { ...form, ...theoryResults, ...trgExResults, ...dsResults, ...overallResults }
      const fd = new FormData()
      for (const field of fields) {
        const val = payload[field]
        if (ARRAY_FIELDS.includes(field)) {
          fd.append(field, JSON.stringify(val))
        } else {
          fd.append(field, val == null ? '' : String(val))
        }
      }
      const res = await fetch(`/api/report?id=${editId}`, { method: 'PATCH', body: fd })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error || 'Failed to update section')
        return
      }
      alert('Section updated successfully')
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  async function handleSave() {
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

      const url = editId ? `/api/report?id=${editId}` : '/api/report/store'
      const method = editId ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, body: fd })

      if (!res.ok) {
        const err = await res.json()
        alert(err.error || 'Failed to save record')
        return
      }

      localStorage.removeItem(STORAGE_KEY)
      router.push('/?success=' + (editId ? 'Record+updated+successfully' : 'Record+saved+successfully'))
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-10 px-4">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-800">{editId ? 'Edit Entry' : 'Add Entry'}</h1>
          <a
            href="/"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            &larr; Back
          </a>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-sm text-zinc-500">
            <span>
              Step {step + 1} of {TOTAL_STEPS}
            </span>
            <span>{Math.round(((step + 1) / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Step indicators */}
        <div className="mb-6 flex flex-wrap gap-2">
          {['Course Info', 'Service & Personal', 'Documents', 'Theory', 'Trg Ex & Misc', 'DS Assessment', 'Overall', 'Signing'].map(
            (label, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStep(i)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  i === step
                    ? 'bg-blue-600 text-white'
                    : i < step
                      ? 'bg-green-100 text-green-700'
                      : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                {i + 1}. {label}
              </button>
            ),
          )}
        </div>

        <form className="space-y-10">
          {/* ── Step 1: Course Information & Personal Profile ── */}
          {step === 0 && (
            <section>
              <div className="mb-4 pb-2 flex items-center justify-between border-b border-zinc-200">
                <h2 className="text-lg font-semibold text-zinc-800">1. Course Information &amp; Personal Profile</h2>
                <button type="button" onClick={resetStep} className="text-xs text-red-600 hover:text-red-800 font-medium">Reset Step</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className={labelCls}>Course Name / अध्ययन</label>
                  <input name="courseName" value={form.courseName} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Serial No / क्रम संख्या</label>
                  <input name="serialNo" value={form.serialNo} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>From / से</label>
                  <DateInput name="fromDate" value={form.fromDate} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelCls}>To / तक</label>
                  <DateInput name="toDate" value={form.toDate} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelCls}>No / नंबर (IC No)</label>
                  <input name="icNo" value={form.icNo} onChange={handleChange} required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Rank / पद</label>
                  <input name="rank" value={form.rank} onChange={handleChange} required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Name / नाम</label>
                  <input name="name" value={form.name} onChange={handleChange} required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Unit / युनिट</label>
                  <input name="unit" value={form.unit} onChange={handleChange} required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Corps / कोर</label>
                  <input name="corps" value={form.corps} onChange={handleChange} required className={inputCls} />
                </div>
              </div>
            </section>
          )}

          {/* ── Step 2: Service & Personal Details ── */}
          {step === 1 && (
            <section>
              <div className="mb-4 pb-2 flex items-center justify-between border-b border-zinc-200">
                <h2 className="text-lg font-semibold text-zinc-800">2. Service &amp; Personal Details</h2>
                <button type="button" onClick={resetStep} className="text-xs text-red-600 hover:text-red-800 font-medium">Reset Step</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className={labelCls}>Formation</label>
                  <input name="formation" value={form.formation} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Command</label>
                  <input name="command" value={form.command} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Appt in the CMP Unit</label>
                  <input name="apptCmpUnit" value={form.apptCmpUnit} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Regt / Crops</label>
                  <input name="regtCrops" value={form.regtCrops} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Date of Commission</label>
                  <DateInput name="dateOfCommission" value={form.dateOfCommission} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelCls}>Date of Seniority</label>
                  <DateInput name="dateOfSeniority" value={form.dateOfSeniority} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelCls}>Date of Sub Ranks</label>
                  <DateInput name="dateOfSubRanks" value={form.dateOfSubRanks} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelCls}>Date of Superannuation</label>
                  <DateInput name="dateOfSuperannuation" value={form.dateOfSuperannuation} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelCls}>Concerned MS (Branch)</label>
                  <input name="concernedMS" value={form.concernedMS} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Date of Birth</label>
                  <DateInput name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelCls}>Age (with Year &amp; Month)</label>
                  <input name="age" value={form.age} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Date of Marriage</label>
                  <DateInput name="dateOfMarriage" value={form.dateOfMarriage} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelCls}>Date of TOS to CMP</label>
                  <DateInput name="dateOfTOS" value={form.dateOfTOS} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelCls}>Date of TORS to CMP</label>
                  <DateInput name="dateOfTORS" value={form.dateOfTORS} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelCls}>Tenure Duration in CMP (Year &amp; Month)</label>
                  <input name="tenureCMP" value={form.tenureCMP} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Arrival Date to CCW</label>
                  <DateInput name="arrivalDateCCW" value={form.arrivalDateCCW} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelCls}>Height (in CM)</label>
                  <input name="height" type="number" value={form.height} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Weight (in KG)</label>
                  <input name="weight" type="number" value={form.weight} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>BMI</label>
                  <input name="bmi" type="number" step="0.1" value={form.bmi} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Medical Category</label>
                  <input name="medicalCategory" value={form.medicalCategory} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Diagnosis</label>
                  <input name="diagnosis" value={form.diagnosis} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>I-Card No</label>
                  <input name="iCardNo" value={form.iCardNo} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Warrant Card No</label>
                  <input name="warrantCardNo" value={form.warrantCardNo} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>PAN Card No</label>
                  <input name="panCardNo" value={form.panCardNo} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Aadhaar Card No</label>
                  <input name="aadhaarCardNo" value={form.aadhaarCardNo} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Passport No</label>
                  <input name="passportNo" value={form.passportNo} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>CDA (O) Acct No</label>
                  <input name="cdaAcctNo" value={form.cdaAcctNo} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Mob No</label>
                  <input name="mobNo" value={form.mobNo} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Email Id</label>
                  <input name="emailId" type="email" value={form.emailId} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Religion</label>
                  <input name="religion" value={form.religion} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Blood Group</label>
                  <input name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Basic Pay</label>
                  <input name="basicPay" value={form.basicPay} onChange={handleChange} className={inputCls} />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <h3 className="mb-2 text-base font-semibold text-zinc-700 border-b border-zinc-100 pb-1">Civil Qualification</h3>
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
                              <input value={row.srNo} onChange={(e) => handleArrayChange('civilQualification', i, 'srNo', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 px-1">
                              <input value={row.qualification} onChange={(e) => handleArrayChange('civilQualification', i, 'qualification', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 px-1">
                              <input value={row.boardUniversity} onChange={(e) => handleArrayChange('civilQualification', i, 'boardUniversity', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 px-1">
                              <input value={row.passingYear} onChange={(e) => handleArrayChange('civilQualification', i, 'passingYear', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 px-1">
                              <input value={row.grading} onChange={(e) => handleArrayChange('civilQualification', i, 'grading', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 pl-1 text-center">
                              <button type="button" onClick={() => removeArrayRow('civilQualification', i)} className="text-red-500 hover:text-red-700 text-lg leading-none">&times;</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button type="button" onClick={() => addArrayRow('civilQualification', { srNo: '', qualification: '', boardUniversity: '', passingYear: '', grading: '' })} className="mt-2 text-sm text-blue-600 hover:text-blue-800">+ Add Qualification</button>
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <h3 className="mb-2 text-base font-semibold text-zinc-700 border-b border-zinc-100 pb-1">Military Education</h3>
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
                              <input value={row.srNo} onChange={(e) => handleArrayChange('militaryEducation', i, 'srNo', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 px-1">
                              <input value={row.nomenclature} onChange={(e) => handleArrayChange('militaryEducation', i, 'nomenclature', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 px-1">
                              <input value={row.institute} onChange={(e) => handleArrayChange('militaryEducation', i, 'institute', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 px-1">
                              <input value={row.year} onChange={(e) => handleArrayChange('militaryEducation', i, 'year', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 px-1">
                              <input value={row.gradingStd} onChange={(e) => handleArrayChange('militaryEducation', i, 'gradingStd', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 pl-1 text-center">
                              <button type="button" onClick={() => removeArrayRow('militaryEducation', i)} className="text-red-500 hover:text-red-700 text-lg leading-none">&times;</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button type="button" onClick={() => addArrayRow('militaryEducation', { srNo: '', nomenclature: '', institute: '', year: '', gradingStd: '' })} className="mt-2 text-sm text-blue-600 hover:text-blue-800">+ Add Military Education</button>
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <h3 className="mb-2 text-base font-semibold text-zinc-700 border-b border-zinc-100 pb-1">Instructional / Staff Appt Records</h3>
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
                              <input value={row.srNo} onChange={(e) => handleArrayChange('instrStaffAppt', i, 'srNo', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 px-1">
                              <input value={row.typeOfInstrAppointment} onChange={(e) => handleArrayChange('instrStaffAppt', i, 'typeOfInstrAppointment', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 px-1">
                              <input value={row.institute} onChange={(e) => handleArrayChange('instrStaffAppt', i, 'institute', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 px-1">
                              <input value={row.duration} onChange={(e) => handleArrayChange('instrStaffAppt', i, 'duration', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 pl-1 text-center">
                              <button type="button" onClick={() => removeArrayRow('instrStaffAppt', i)} className="text-red-500 hover:text-red-700 text-lg leading-none">&times;</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button type="button" onClick={() => addArrayRow('instrStaffAppt', { srNo: '', typeOfInstrAppointment: '', institute: '', duration: '' })} className="mt-2 text-sm text-blue-600 hover:text-blue-800">+ Add Record</button>
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <h3 className="mb-2 text-base font-semibold text-zinc-700 border-b border-zinc-100 pb-1">Posting Record (Peace / Field)</h3>
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
                              <input value={row.srNo} onChange={(e) => handleArrayChange('postingRecord', i, 'srNo', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 px-1">
                              <input value={row.unitName} onChange={(e) => handleArrayChange('postingRecord', i, 'unitName', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 px-1">
                              <input value={row.typeOfUnit} onChange={(e) => handleArrayChange('postingRecord', i, 'typeOfUnit', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 px-1">
                              <input value={row.duration} onChange={(e) => handleArrayChange('postingRecord', i, 'duration', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 px-1">
                              <input value={row.specialAchievement} onChange={(e) => handleArrayChange('postingRecord', i, 'specialAchievement', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 pl-1 text-center">
                              <button type="button" onClick={() => removeArrayRow('postingRecord', i)} className="text-red-500 hover:text-red-700 text-lg leading-none">&times;</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button type="button" onClick={() => addArrayRow('postingRecord', { srNo: '', unitName: '', typeOfUnit: '', duration: '', specialAchievement: '' })} className="mt-2 text-sm text-blue-600 hover:text-blue-800">+ Add Posting Record</button>
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <h3 className="mb-2 text-base font-semibold text-zinc-700 border-b border-zinc-100 pb-1">Family Details</h3>
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
                              <input value={row.srNo} onChange={(e) => handleArrayChange('familyDetails', i, 'srNo', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 px-1">
                              <input value={row.name} onChange={(e) => handleArrayChange('familyDetails', i, 'name', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 px-1">
                              <input value={row.relation} onChange={(e) => handleArrayChange('familyDetails', i, 'relation', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 px-1">
                              <DateInput name="dob" value={row.dob} onChange={(e) => handleArrayChange('familyDetails', i, 'dob', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 px-1">
                              <input value={row.education} onChange={(e) => handleArrayChange('familyDetails', i, 'education', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 px-1">
                              <input value={row.occupation} onChange={(e) => handleArrayChange('familyDetails', i, 'occupation', e.target.value)} className="w-full rounded border border-zinc-300 px-1 py-0.5 text-sm focus:border-blue-500 focus:outline-none" />
                            </td>
                            <td className="py-1 pl-1 text-center">
                              <button type="button" onClick={() => removeArrayRow('familyDetails', i)} className="text-red-500 hover:text-red-700 text-lg leading-none">&times;</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button type="button" onClick={() => addArrayRow('familyDetails', { srNo: '', name: '', relation: '', dob: '', education: '', occupation: '' })} className="mt-2 text-sm text-blue-600 hover:text-blue-800">+ Add Family Member</button>
                </div>
              </div>
            </section>
          )}

          {/* ── Step 3: Documents & Clearances ── */}
          {step === 2 && (
            <section>
              <div className="mb-4 pb-2 flex items-center justify-between border-b border-zinc-200">
                <h2 className="text-lg font-semibold text-zinc-800">3. Documents &amp; Clearances</h2>
                <button type="button" onClick={resetStep} className="text-xs text-red-600 hover:text-red-800 font-medium">Reset Step</button>
              </div>
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
                            <input type="radio" name={key} value="Yes" checked={form[key] === 'Yes'} onChange={handleChange} /> Yes
                          </label>
                          <label className="inline-flex items-center gap-2 text-sm ml-3">
                            <input type="radio" name={key} value="No" checked={form[key] === 'No'} onChange={handleChange} /> No
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
                  <select name="foodPreference" value={form.foodPreference} onChange={handleChange} className={inputCls}>
                    <option value="Veg">Veg</option>
                    <option value="Non Veg">Non Veg</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Departure Date</label>
                  <DateInput name="departureDate" value={form.departureDate} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelCls}>Date of SORS from CCW</label>
                  <DateInput name="dateOfSORS" value={form.dateOfSORS} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelCls}>Jain University Ser Number</label>
                  <input name="jainUniversitySerNo" value={form.jainUniversitySerNo} onChange={handleChange} className={inputCls} />
                </div>
              </div>
            </section>
          )}

          {/* ── Step 4: Result (Theory) ── */}
          {step === 3 && (
            <section>
              <div className="mb-4 pb-2 flex items-center justify-between border-b border-zinc-200">
                <h2 className="text-lg font-semibold text-zinc-800">4. Result (Theory)</h2>
                <button type="button" onClick={resetStep} className="text-xs text-red-600 hover:text-red-800 font-medium">Reset Step</button>
              </div>
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
                        <input value={theoryResults.totalTheory} readOnly className="w-full rounded bg-blue-100 px-2 py-1 text-center text-sm" />
                      </td>
                    </tr>
                    <tr className="bg-green-50 font-semibold">
                      <td className="py-2 pr-4 text-zinc-800">Percentage</td>
                      <td className="py-2 px-2 text-center text-zinc-600">/ 100</td>
                      <td className="py-2 pl-2">
                        <input value={`${theoryResults.theoryPercentage}%`} readOnly className="w-full rounded bg-green-100 px-2 py-1 text-center text-sm" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ── Step 5: Result (Trg Ex & Misc Assessment) ── */}
          {step === 4 && (
            <section>
              <div className="mb-4 pb-2 flex items-center justify-between border-b border-zinc-200">
                <h2 className="text-lg font-semibold text-zinc-800">5. Result (Trg Ex &amp; Misc Assessment)</h2>
                <button type="button" onClick={resetStep} className="text-xs text-red-600 hover:text-red-800 font-medium">Reset Step</button>
              </div>
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
                        <input value={trgExResults.totalTrgEx} readOnly className="w-full rounded bg-blue-100 px-2 py-1 text-center text-sm" />
                      </td>
                    </tr>
                    <tr className="bg-green-50 font-semibold">
                      <td className="py-2 pr-4 text-zinc-800">Percentage</td>
                      <td className="py-2 px-2 text-center text-zinc-600">/ 100</td>
                      <td className="py-2 pl-2">
                        <input value={`${trgExResults.trgExPercentage}%`} readOnly className="w-full rounded bg-green-100 px-2 py-1 text-center text-sm" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ── Step 6: DS Assessment ── */}
          {step === 5 && (
            <section>
              <div className="mb-4 pb-2 flex items-center justify-between border-b border-zinc-200">
                <h2 className="text-lg font-semibold text-zinc-800">6. DS Assessment</h2>
                <button type="button" onClick={resetStep} className="text-xs text-red-600 hover:text-red-800 font-medium">Reset Step</button>
              </div>
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
                        <input value={dsResults.totalDS} readOnly className="w-full rounded bg-blue-100 px-2 py-1 text-center text-sm" />
                      </td>
                    </tr>
                    <tr className="bg-green-50 font-semibold">
                      <td className="py-2 pr-4 text-zinc-800">Percentage</td>
                      <td className="py-2 px-2 text-center text-zinc-600">/ 100</td>
                      <td className="py-2 pl-2">
                        <input value={`${dsResults.dsPercentage}%`} readOnly className="w-full rounded bg-green-100 px-2 py-1 text-center text-sm" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ── Step 7: Over All Result ── */}
          {step === 6 && (
            <section>
              <div className="mb-4 pb-2 flex items-center justify-between border-b border-zinc-200">
                <h2 className="text-lg font-semibold text-zinc-800">7. Over All Result</h2>
                <button type="button" onClick={resetStep} className="text-xs text-red-600 hover:text-red-800 font-medium">Reset Step</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-600">
                      <th className="py-2 pr-2 text-left font-medium">Component</th>
                      <th className="py-2 px-2 text-center font-medium w-20">Max</th>
                      <th className="py-2 px-2 text-center font-medium w-24">Obtained</th>
                      <th className="py-2 pl-2 text-center font-medium w-24">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-zinc-100">
                      <td className="py-2 pr-2 text-zinc-800">Result (Theory)</td>
                      <td className="py-2 px-2 text-center text-zinc-600">/ 300</td>
                      <td className="py-2 px-2">
                        <input value={theoryResults.totalTheory} readOnly className="w-full rounded bg-zinc-100 px-2 py-1 text-center text-sm" />
                      </td>
                      <td className="py-2 pl-2">
                        <input value={`${theoryResults.theoryPercentage}%`} readOnly className="w-full rounded bg-zinc-100 px-2 py-1 text-center text-sm" />
                      </td>
                    </tr>
                    <tr className="border-b border-zinc-100">
                      <td className="py-2 pr-2 text-zinc-800">Result (Trg Ex &amp; Misc)</td>
                      <td className="py-2 px-2 text-center text-zinc-600">/ 250</td>
                      <td className="py-2 px-2">
                        <input value={trgExResults.totalTrgEx} readOnly className="w-full rounded bg-zinc-100 px-2 py-1 text-center text-sm" />
                      </td>
                      <td className="py-2 pl-2">
                        <input value={`${trgExResults.trgExPercentage}%`} readOnly className="w-full rounded bg-zinc-100 px-2 py-1 text-center text-sm" />
                      </td>
                    </tr>
                    <tr className="border-b border-zinc-100">
                      <td className="py-2 pr-2 text-zinc-800">DS Assessment</td>
                      <td className="py-2 px-2 text-center text-zinc-600">/ 50</td>
                      <td className="py-2 px-2">
                        <input value={dsResults.totalDS} readOnly className="w-full rounded bg-zinc-100 px-2 py-1 text-center text-sm" />
                      </td>
                      <td className="py-2 pl-2">
                        <input value={`${dsResults.dsPercentage}%`} readOnly className="w-full rounded bg-zinc-100 px-2 py-1 text-center text-sm" />
                      </td>
                    </tr>
                    <tr className="bg-blue-50 font-semibold">
                      <td className="py-2 pr-2 text-zinc-800">Total</td>
                      <td className="py-2 px-2 text-center text-zinc-600">/ 600</td>
                      <td className="py-2 px-2">
                        <input value={overallResults.totalOverall} readOnly className="w-full rounded bg-blue-100 px-2 py-1 text-center text-sm" />
                      </td>
                      <td className="py-2 pl-2">
                        <input value={`${overallResults.overallPercentage}%`} readOnly className="w-full rounded bg-blue-100 px-2 py-1 text-center text-sm" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <label className={labelCls}>Grading / दर्जा</label>
                <input name="grading" value={form.grading} onChange={handleChange} className={`${inputCls} max-w-[120px]`} />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>ज्ञान / Knowledge</label>
                  <input name="knowledge" value={form.knowledge} onChange={handleChange} placeholder="e.g. ABOVE AVERAGE" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>उपयोग / Application</label>
                  <input name="application" value={form.application} onChange={handleChange} placeholder="e.g. ABOVE AVERAGE" className={inputCls} />
                </div>
              </div>
              <div className="mt-4">
                <label className={labelCls}>संक्षिप्तवर्णन / Pen Picture</label>
                <RichTextEditor value={form.penPicture} onChange={(value) => persistForm((prev) => ({ ...prev, penPicture: value }))} />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>कोर्स चिन्ह / Course Symbol</label>
                  <input name="courseSymbol" value={form.courseSymbol} onChange={handleChange} placeholder="e.g. OPC" className={`${inputCls} max-w-[120px]`} />
                </div>
              </div>
              <div className="mt-4">
                <label className={labelCls}>अनुदेशण क्षमता / Instructional Ability</label>
                <textarea name="instructionalAbility" value={form.instructionalAbility} onChange={handleChange} rows={2} placeholder="e.g. The officer is fit to be an Instructor." className={inputCls} />
              </div>
            </section>
          )}

          {/* ── Step 8: Signing Authority ── */}
          {step === 7 && (
            <section>
              <div className="mb-4 pb-2 flex items-center justify-between border-b border-zinc-200">
                <h2 className="text-lg font-semibold text-zinc-800">8. Signing Authority</h2>
                <button type="button" onClick={resetStep} className="text-xs text-red-600 hover:text-red-800 font-medium">Reset Step</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className={labelCls}>नं / No (Report No)</label>
                  <input name="reportNo" value={form.reportNo} onChange={handleChange} placeholder="e.g. 1080/OPC-214/G" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Authority Rank / पद</label>
                  <input name="authorityRank" value={form.authorityRank} onChange={handleChange} placeholder="e.g. Brigadier" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Authority Name</label>
                  <input name="authorityName" value={form.authorityName} onChange={handleChange} placeholder="e.g. Mayank Vaid" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>स्थान / Station</label>
                  <input name="station" value={form.station} onChange={handleChange} placeholder="e.g. C/o 56 APO" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>कमांडेंट / Authority Title</label>
                  <input name="authorityTitle" value={form.authorityTitle} onChange={handleChange} placeholder="e.g. Commandant" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>दिनाँक / Date</label>
                  <input name="reportDate" value={form.reportDate} onChange={handleChange} placeholder="e.g. Apr 2026" className={inputCls} />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className={labelCls}>Organization (Hindi)</label>
                  <input name="orgNameHindi" value={form.orgNameHindi} onChange={handleChange} placeholder="e.g. सेना पुलिस कोर केंद्र एंव स्कूल" className={inputCls} />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className={labelCls}>Organization (English)</label>
                  <input name="orgNameEnglish" value={form.orgNameEnglish} onChange={handleChange} placeholder="e.g. CMP Centre and School" className={inputCls} />
                </div>
              </div>
            </section>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between border-t border-zinc-200 pt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 0}
              className="rounded-lg border border-zinc-300 px-6 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              &larr; Previous
            </button>

            {editId && (
              <button
                type="button"
                onClick={handleSectionUpdate}
                disabled={updating}
                className="rounded-lg bg-amber-500 px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updating ? 'Updating...' : 'Update Section'}
              </button>
            )}
            {step < TOTAL_STEPS - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
              >
                Next &rarr;
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Save Record'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AddEntry() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50 py-10 px-4"><div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow-lg"><p className="text-zinc-500">Loading...</p></div></div>}>
      <AddEntryForm />
    </Suspense>
  )
}
