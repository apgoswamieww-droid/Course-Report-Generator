import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import fs from 'fs'
import path from 'path'

function fmtDate(val) {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return String(val)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

const FOOTER_XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="808080"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="808080"/></w:rPr><w:instrText> PAGE </w:instrText></w:r><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="808080"/></w:rPr><w:fldChar w:fldCharType="end"/></w:r><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="808080"/></w:rPr><w:t xml:space="preserve"> of </w:t></w:r><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="808080"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="808080"/></w:rPr><w:instrText> NUMPAGES </w:instrText></w:r><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="808080"/></w:rPr><w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>'

const FOOTER_REL = '<Relationship Id="rIdFooter" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>'

const FOOTER_CT = '<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>'

/**
 * Add a "Page X of Y" footer to a PizZip docx instance.
 * Adds footer1.xml, updates rels, content types, and sectPr.
 */
export function addPageNumberFooter(zip) {
  // Skip if footer already exists
  if (zip.files['word/footer1.xml']) return

  // 1. Add footer XML
  zip.file('word/footer1.xml', FOOTER_XML)

  // 2. Update document.xml.rels - add footer relationship
  const relsPath = 'word/_rels/document.xml.rels'
  const relsXml = zip.files[relsPath] ? zip.files[relsPath].asText() : ''
  if (!relsXml.includes('rIdFooter')) {
    const updatedRels = relsXml.replace('</Relationships>', FOOTER_REL + '</Relationships>')
    zip.file(relsPath, updatedRels)
  }

  // 3. Update [Content_Types].xml
  const ctPath = '[Content_Types].xml'
  const ctXml = zip.files[ctPath] ? zip.files[ctPath].asText() : ''
  if (!ctXml.includes('footer1.xml')) {
    const updatedCt = ctXml.replace('</Types>', FOOTER_CT + '</Types>')
    zip.file(ctPath, updatedCt)
  }

  // 4. Add footer reference to sectPr in document.xml
  const docPath = 'word/document.xml'
  const docXml = zip.files[docPath] ? zip.files[docPath].asText() : ''
  if (docXml.includes('<w:sectPr') && !docXml.includes('w:footerReference')) {
    const footerRef = '<w:footerReference w:type="default" r:id="rIdFooter"/>'
    // Add footer reference at the start of sectPr (before other elements)
    const updatedDoc = docXml.replace('<w:sectPr>', '<w:sectPr>' + footerRef)
    zip.file(docPath, updatedDoc)
  }
}

export function generateDocxBuffer(body) {
  const templatePath = path.join(process.cwd(), 'public', '5 Course Report OPC  214.docx')
  const templateContent = fs.readFileSync(templatePath)
  const zip = new PizZip(templateContent)
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  })

  doc.render({
    courseName: body.courseName || '',
    serialNo: body.serialNo || '',
    fromDate: fmtDate(body.fromDate),
    toDate: fmtDate(body.toDate),
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
    dateOfCommission: fmtDate(body.dateOfCommission),
    dateOfSeniority: fmtDate(body.dateOfSeniority),
    dateOfSubRanks: fmtDate(body.dateOfSubRanks),
    dateOfSuperannuation: fmtDate(body.dateOfSuperannuation),
    concernedMS: body.concernedMS || '',
    dateOfBirth: fmtDate(body.dateOfBirth),
    age: body.age || '',
    dateOfMarriage: fmtDate(body.dateOfMarriage),
    dateOfTOS: fmtDate(body.dateOfTOS),
    dateOfTORS: fmtDate(body.dateOfTORS),
    tenureCMP: body.tenureCMP || '',
    arrivalDateCCW: fmtDate(body.arrivalDateCCW),
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
    departureDate: fmtDate(body.departureDate),
    dateOfSORS: fmtDate(body.dateOfSORS),
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
      ? body.civilQualification.map((q) =>
          `${q.srNo || ''}. ${q.qualification || ''} - ${q.boardUniversity || ''} (${q.passingYear || ''}) [${q.grading || ''}]`
        ).join('\n')
      : '',
    militaryEducation: Array.isArray(body.militaryEducation)
      ? body.militaryEducation.map((m) =>
          `${m.srNo || ''}. ${m.nomenclature || ''} - ${m.institute || ''} (${m.year || ''}) [${m.gradingStd || ''}]`
        ).join('\n')
      : '',
    instrStaffAppt: Array.isArray(body.instrStaffAppt)
      ? body.instrStaffAppt.map((a) =>
          `${a.srNo || ''}. ${a.typeOfInstrAppointment || ''} - ${a.institute || ''} (${a.duration || ''})`
        ).join('\n')
      : '',
    postingRecord: Array.isArray(body.postingRecord)
      ? body.postingRecord.map((p) =>
          `${p.srNo || ''}. ${p.unitName || ''} (${p.typeOfUnit || ''}) - ${p.duration || ''}${p.specialAchievement ? ` [${p.specialAchievement}]` : ''}`
        ).join('\n')
      : '',
    familyDetails: Array.isArray(body.familyDetails)
      ? body.familyDetails.map((f) =>
          `${f.srNo || ''}. ${f.name || ''} (${f.relation || ''}) - ${f.dob || ''} | Edu: ${f.education || ''} | Occ: ${f.occupation || ''}`
        ).join('\n')
      : '',
    courseSymbol: body.courseSymbol || '',
    penPicture: body.penPicture || '',
    orderOfMerit: body.orderOfMerit || '',
    totalOfficers: body.totalOfficers || '',
    grading: body.grading || '',
    remarks: body.remarks || '',
    authorityName: body.authorityName || '',
    reportNo: body.reportNo || '',
    authorityRank: body.authorityRank || '',
    station: body.station || '',
    authorityTitle: body.authorityTitle || '',
    reportDate: fmtDate(body.reportDate),
    orgNameHindi: body.orgNameHindi || '',
    orgNameEnglish: body.orgNameEnglish || '',
  })

  const zipOut = doc.getZip()

  // The template is missing <w:sectPr> (section properties).
  // Without it, LibreOffice/Word shows 'corrupted file'.
  // Ensure a default A4 section property is present.
  const docXml = zipOut.file('word/document.xml').asText()
  if (!docXml.includes('<w:sectPr')) {
    const sectPr = '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/><w:cols w:space="720"/></w:sectPr>'
    const fixedXml = docXml.replace('</w:body>', sectPr + '</w:body>')
    zipOut.file('word/document.xml', fixedXml)
  }

  // Add page number footer
  addPageNumberFooter(zipOut)

  return zipOut.generate({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  })
}
