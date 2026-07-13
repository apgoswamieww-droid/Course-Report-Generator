import { NextResponse } from 'next/server'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import fs from 'fs'
import path from 'path'
import { connectDB, CourseReport } from '@/lib/db'

const ARRAY_FIELDS = ['civilQualification', 'militaryEducation', 'instrStaffAppt', 'postingRecord', 'familyDetails']

export async function POST(request) {
  try {
    const data = await request.formData()
    const body = {}

    for (const [key, val] of data.entries()) {
      if (ARRAY_FIELDS.includes(key)) {
        try {
          body[key] = JSON.parse(val)
        } catch {
          body[key] = []
        }
      } else if (val instanceof File) {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }
        const ext = path.extname(val.name) || ''
        const filename = `${Date.now()}-${val.name.replace(/\s+/g, '_')}`
        const filepath = path.join(uploadDir, filename)
        const buffer = Buffer.from(await val.arrayBuffer())
        fs.writeFileSync(filepath, buffer)
        body[key] = `/uploads/${filename}`
      } else {
        body[key] = val
      }
    }

    await connectDB()

    const report = await CourseReport.create(body)

    const templatePath = path.join(
      process.cwd(),
      'public',
      '5 Course Report OPC  214.docx'
    )
    const templateContent = fs.readFileSync(templatePath)
    const zip = new PizZip(templateContent)
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    })

    doc.setData({
      courseName: body.courseName || '',
      serialNo: body.serialNo || '',
      fromDate: body.fromDate || '',
      toDate: body.toDate || '',
      icNo: body.icNo || '',
      rank: body.rank || '',
      name: body.name || '',
      unit: body.unit || '',
      corps: body.corps || '',
      lawMax: body.lawMax?.toString() || '',
      lawObt: body.lawObt?.toString() || '',
      lawEnforcementMax: body.lawEnforcementMax?.toString() || '',
      lawEnforcementObt: body.lawEnforcementObt?.toString() || '',
      trafficManagementMax: body.trafficManagementMax?.toString() || '',
      trafficManagementObt: body.trafficManagementObt?.toString() || '',
      investigationMax: body.investigationMax?.toString() || '',
      investigationObt: body.investigationObt?.toString() || '',
      caseStudyMax: body.caseStudyMax?.toString() || '',
      caseStudyObt: body.caseStudyObt?.toString() || '',
      thoughtProcessMax: body.thoughtProcessMax?.toString() || '',
      thoughtProcessObt: body.thoughtProcessObt?.toString() || '',
      militaryPaperMax: body.militaryPaperMax?.toString() || '',
      militaryPaperObt: body.militaryPaperObt?.toString() || '',
      militarySplMax: body.militarySplMax?.toString() || '',
      militarySplObt: body.militarySplObt?.toString() || '',
      coreCompetencyMax: body.coreCompetencyMax?.toString() || '',
      coreCompetencyObt: body.coreCompetencyObt?.toString() || '',
      weaponMax: body.weaponMax?.toString() || '',
      weaponObt: body.weaponObt?.toString() || '',
      mapReadingMax: body.mapReadingMax?.toString() || '',
      mapReadingObt: body.mapReadingObt?.toString() || '',
      practicalMax: body.practicalMax?.toString() || '',
      practicalObt: body.practicalObt?.toString() || '',
      theoryMax: body.theoryMax?.toString() || '',
      theoryObt: body.theoryObt?.toString() || '',
      totalMax: body.totalMax?.toString() || '',
      totalObt: body.totalObt?.toString() || '',
      knowledge: body.knowledge || '',
      application: body.application || '',
      instructionalAbility: body.instructionalAbility || '',
      professionalCompetence: body.professionalCompetence || '',
      verbalExpression: body.verbalExpression || '',
      writtenExpression: body.writtenExpression || '',
      cooperationTeamwork: body.cooperationTeamwork || '',
      technicalUnderstanding: body.technicalUnderstanding || '',
      tacticalFunctioning: body.tacticalFunctioning || '',
      formation: body.formation || '',
      command: body.command || '',
      apptCmpUnit: body.apptCmpUnit || '',
      regtCrops: body.regtCrops || '',
      dateOfCommission: body.dateOfCommission || '',
      dateOfSeniority: body.dateOfSeniority || '',
      dateOfSubRanks: body.dateOfSubRanks || '',
      dateOfSuperannuation: body.dateOfSuperannuation || '',
      concernedMS: body.concernedMS || '',
      dateOfBirth: body.dateOfBirth || '',
      age: body.age || '',
      dateOfMarriage: body.dateOfMarriage || '',
      dateOfTOS: body.dateOfTOS || '',
      dateOfTORS: body.dateOfTORS || '',
      tenureCMP: body.tenureCMP || '',
      arrivalDateCCW: body.arrivalDateCCW || '',
      foodPreference: body.foodPreference || '',
      admInfo: body.admInfo || '',
      admInfoDoc: body.admInfoDoc || '',
      movementOrder: body.movementOrder || '',
      movementOrderDoc: body.movementOrderDoc || '',
      lrc: body.lrc || '',
      lrcDoc: body.lrcDoc || '',
      willingnessCert: body.willingnessCert || '',
      willingnessCertDoc: body.willingnessCertDoc || '',
      medicalCert: body.medicalCert || '',
      medicalCertDoc: body.medicalCertDoc || '',
      nominalRoll: body.nominalRoll || '',
      nominalRollDoc: body.nominalRollDoc || '',
      etg: body.etg || '',
      etgDoc: body.etgDoc || '',
      cyberSecurityCert: body.cyberSecurityCert || '',
      cyberSecurityCertDoc: body.cyberSecurityCertDoc || '',
      appxFAO: body.appxFAO || '',
      appxFAODoc: body.appxFAODoc || '',
      teiFeedback: body.teiFeedback || '',
      teiFeedbackDoc: body.teiFeedbackDoc || '',
      teiFeedbackPoints: body.teiFeedbackPoints || '',
      admFeedbackPoints: body.admFeedbackPoints || '',
      admFeedback: body.admFeedback || '',
      admFeedbackDoc: body.admFeedbackDoc || '',
      mutualAssessment: body.mutualAssessment || '',
      mutualAssessmentDoc: body.mutualAssessmentDoc || '',
      withFamily: body.withFamily || '',
      withFamilyDoc: body.withFamilyDoc || '',
      departureDate: body.departureDate || '',
      dateOfSORS: body.dateOfSORS || '',
      jainUniversitySerNo: body.jainUniversitySerNo || '',
      entrance: body.entrance?.toString() || '',
      lawEnforcementTheory: body.lawEnforcementTheory?.toString() || '',
      trafficManagementTheory: body.trafficManagementTheory?.toString() || '',
      investigationTheory: body.investigationTheory?.toString() || '',
      lawTheory: body.lawTheory?.toString() || '',
      totalTheory: body.totalTheory?.toString() || '',
      theoryPercentage: body.theoryPercentage?.toString() || '',
      exAnushashan: body.exAnushashan?.toString() || '',
      exKabu: body.exKabu?.toString() || '',
      exNandi: body.exNandi?.toString() || '',
      exMaruVijay: body.exMaruVijay?.toString() || '',
      exKhoj: body.exKhoj?.toString() || '',
      caseStudyTrg: body.caseStudyTrg?.toString() || '',
      misc20: body.misc20?.toString() || '',
      militaryPaperTrg: body.militaryPaperTrg?.toString() || '',
      totalTrgEx: body.totalTrgEx?.toString() || '',
      trgExPercentage: body.trgExPercentage?.toString() || '',
      dsII: body.dsII?.toString() || '',
      dsI: body.dsI?.toString() || '',
      ocCCW: body.ocCCW?.toString() || '',
      dcci: body.dcci?.toString() || '',
      commandant: body.commandant?.toString() || '',
      totalDS: body.totalDS?.toString() || '',
      dsPercentage: body.dsPercentage?.toString() || '',
      totalOverall: body.totalOverall?.toString() || '',
      overallPercentage: body.overallPercentage?.toString() || '',
      height: body.height?.toString() || '',
      weight: body.weight?.toString() || '',
      bmi: body.bmi?.toString() || '',
      medicalCategory: body.medicalCategory || '',
      diagnosis: body.diagnosis || '',
      iCardNo: body.iCardNo || '',
      warrantCardNo: body.warrantCardNo || '',
      panCardNo: body.panCardNo || '',
      aadhaarCardNo: body.aadhaarCardNo || '',
      passportNo: body.passportNo || '',
      cdaAcctNo: body.cdaAcctNo || '',
      mobNo: body.mobNo || '',
      emailId: body.emailId || '',
      religion: body.religion || '',
      bloodGroup: body.bloodGroup || '',
      basicPay: body.basicPay || '',
      civilQualification: Array.isArray(body.civilQualification)
        ? body.civilQualification
            .map(
              (q) =>
                `${q.srNo || ''}. ${q.qualification || ''} - ${q.boardUniversity || ''} (${q.passingYear || ''}) [${q.grading || ''}]`
            )
            .join('\n')
        : '',
      militaryEducation: Array.isArray(body.militaryEducation)
        ? body.militaryEducation
            .map(
              (m) =>
                `${m.srNo || ''}. ${m.nomenclature || ''} - ${m.institute || ''} (${m.year || ''}) [${m.gradingStd || ''}]`
            )
            .join('\n')
        : '',
      instrStaffAppt: Array.isArray(body.instrStaffAppt)
        ? body.instrStaffAppt
            .map(
              (a) =>
                `${a.srNo || ''}. ${a.typeOfInstrAppointment || ''} - ${a.institute || ''} (${a.duration || ''})`
            )
            .join('\n')
        : '',
      postingRecord: Array.isArray(body.postingRecord)
        ? body.postingRecord
            .map(
              (p) =>
                `${p.srNo || ''}. ${p.unitName || ''} (${p.typeOfUnit || ''}) - ${p.duration || ''}${p.specialAchievement ? ` [${p.specialAchievement}]` : ''}`
            )
            .join('\n')
        : '',
      familyDetails: Array.isArray(body.familyDetails)
        ? body.familyDetails
            .map(
              (f) =>
                `${f.srNo || ''}. ${f.name || ''} (${f.relation || ''}) - ${f.dob || ''} | Edu: ${f.education || ''} | Occ: ${f.occupation || ''}`
            )
            .join('\n')
        : '',
      courseSymbol: body.courseSymbol || '',
      penPicture: body.penPicture || '',
      orderOfMerit: body.orderOfMerit || '',
      totalOfficers: body.totalOfficers || '',
      grading: body.grading || '',
      remarks: body.remarks || '',
    })

    doc.render()

    const buffer = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    })

    const filename = `Report_${body.icNo || 'draft'}.docx`

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}
