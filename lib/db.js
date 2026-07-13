import mongoose from 'mongoose'

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable')
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

const courseReportSchema = new mongoose.Schema({
  courseName: String,
  serialNo: String,
  fromDate: Date,
  toDate: Date,
  icNo: { type: String, unique: true },
  rank: String,
  name: String,
  unit: String,
  corps: String,
  lawMax: Number,
  lawObt: Number,
  lawEnforcementMax: Number,
  lawEnforcementObt: Number,
  trafficManagementMax: Number,
  trafficManagementObt: Number,
  investigationMax: Number,
  investigationObt: Number,
  caseStudyMax: Number,
  caseStudyObt: Number,
  thoughtProcessMax: Number,
  thoughtProcessObt: Number,
  militaryPaperMax: Number,
  militaryPaperObt: Number,
  militarySplMax: Number,
  militarySplObt: Number,
  coreCompetencyMax: Number,
  coreCompetencyObt: Number,
  weaponMax: Number,
  weaponObt: Number,
  mapReadingMax: Number,
  mapReadingObt: Number,
  practicalMax: Number,
  practicalObt: Number,
  theoryMax: Number,
  theoryObt: Number,
  totalMax: Number,
  totalObt: Number,
  knowledge: { type: String, default: 'AVERAGE' },
  application: { type: String, default: 'AVERAGE' },
  instructionalAbility: { type: String, default: 'AVERAGE' },
  professionalCompetence: { type: String, default: 'AVERAGE' },
  verbalExpression: { type: String, default: 'AVERAGE' },
  writtenExpression: { type: String, default: 'AVERAGE' },
  cooperationTeamwork: { type: String, default: 'AVERAGE' },
  technicalUnderstanding: { type: String, default: 'AVERAGE' },
  tacticalFunctioning: { type: String, default: 'AVERAGE' },
  formation: String,
  command: String,
  apptCmpUnit: String,
  regtCrops: String,
  dateOfCommission: Date,
  dateOfSeniority: Date,
  dateOfSubRanks: Date,
  dateOfSuperannuation: Date,
  concernedMS: String,
  dateOfBirth: Date,
  age: String,
  dateOfMarriage: Date,
  dateOfTOS: Date,
  dateOfTORS: Date,
  tenureCMP: String,
  arrivalDateCCW: Date,
  foodPreference: { type: String, default: 'Veg' },
  admInfo: { type: String, default: 'No' },
  admInfoDoc: String,
  movementOrder: { type: String, default: 'No' },
  movementOrderDoc: String,
  lrc: { type: String, default: 'No' },
  lrcDoc: String,
  willingnessCert: { type: String, default: 'No' },
  willingnessCertDoc: String,
  medicalCert: { type: String, default: 'No' },
  medicalCertDoc: String,
  nominalRoll: { type: String, default: 'No' },
  nominalRollDoc: String,
  etg: { type: String, default: 'No' },
  etgDoc: String,
  cyberSecurityCert: { type: String, default: 'No' },
  cyberSecurityCertDoc: String,
  appxFAO: { type: String, default: 'No' },
  appxFAODoc: String,
  teiFeedback: { type: String, default: 'No' },
  teiFeedbackDoc: String,
  teiFeedbackPoints: String,
  admFeedbackPoints: String,
  admFeedback: { type: String, default: 'No' },
  admFeedbackDoc: String,
  mutualAssessment: { type: String, default: 'No' },
  mutualAssessmentDoc: String,
  withFamily: { type: String, default: 'No' },
  withFamilyDoc: String,
  height: Number,
  weight: Number,
  bmi: Number,
  medicalCategory: String,
  diagnosis: String,
  iCardNo: String,
  warrantCardNo: String,
  panCardNo: String,
  aadhaarCardNo: String,
  passportNo: String,
  cdaAcctNo: String,
  mobNo: String,
  emailId: String,
  religion: String,
  bloodGroup: String,
  basicPay: String,
  civilQualification: [{
    srNo: String,
    qualification: String,
    boardUniversity: String,
    passingYear: String,
    grading: String,
  }],
  militaryEducation: [{
    srNo: String,
    nomenclature: String,
    institute: String,
    year: String,
    gradingStd: String,
  }],
  instrStaffAppt: [{
    srNo: String,
    typeOfInstrAppointment: String,
    institute: String,
    duration: String,
  }],
  postingRecord: [{
    srNo: String,
    unitName: String,
    typeOfUnit: String,
    duration: String,
    specialAchievement: String,
  }],
  familyDetails: [{
    srNo: String,
    name: String,
    relation: String,
    dob: Date,
    education: String,
    occupation: String,
  }],
  departureDate: Date,
  dateOfSORS: Date,
  jainUniversitySerNo: String,
  entrance: Number,
  lawEnforcementTheory: Number,
  trafficManagementTheory: Number,
  investigationTheory: Number,
  lawTheory: Number,
  totalTheory: Number,
  theoryPercentage: Number,
  exAnushashan: Number,
  exKabu: Number,
  exNandi: Number,
  exMaruVijay: Number,
  exKhoj: Number,
  caseStudyTrg: Number,
  misc20: Number,
  militaryPaperTrg: Number,
  totalTrgEx: Number,
  trgExPercentage: Number,
  dsII: Number,
  dsI: Number,
  ocCCW: Number,
  dcci: Number,
  commandant: Number,
  totalDS: Number,
  dsPercentage: Number,
  totalOverall: Number,
  overallPercentage: Number,
  courseSymbol: String,
  penPicture: String,
  orderOfMerit: String,
  totalOfficers: String,
  grading: { type: String, default: 'Q' },
  remarks: String,
})

export const CourseReport =
  mongoose.models.CourseReport ||
  mongoose.model('CourseReport', courseReportSchema)
