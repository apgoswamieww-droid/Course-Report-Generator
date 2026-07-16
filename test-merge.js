const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'public', '5 Course Report OPC  214.docx');
const templateContent = fs.readFileSync(templatePath);

// Create three mock reports with VERY different data to verify uniqueness
const reports = [
  {
    icNo: 'IC111111', rank: 'Major', name: 'ALICE SMITH', unit: 'Alpha Unit', corps: 'Infantry',
    courseName: 'Course A', serialNo: '1', fromDate: '01/01/2026', toDate: '31/12/2026',
    knowledge: 'HIGH', application: 'AVERAGE', penPicture: 'Alice pen picture',
    courseSymbol: 'CA-1', instructionalAbility: 'GOOD', grading: 'A',
    reportNo: 'RPT-001', authorityName: 'Gen Alpha', authorityRank: 'Brigadier',
    station: 'Delhi', authorityTitle: 'Commandant', reportDate: 'Jan 2026',
    orgNameHindi: 'संगठन', orgNameEnglish: 'Alpha Org', formation: 'F1', command: 'C1',
  },
  {
    icNo: 'IC222222', rank: 'Captain', name: 'BOB JONES', unit: 'Beta Unit', corps: 'Armoured',
    courseName: 'Course B', serialNo: '2', fromDate: '15/03/2026', toDate: '14/09/2026',
    knowledge: 'AVERAGE', application: 'LOW', penPicture: 'Bob pen picture different',
    courseSymbol: 'CB-2', instructionalAbility: 'FAIR', grading: 'B',
    reportNo: 'RPT-002', authorityName: 'Gen Beta', authorityRank: 'Colonel',
    station: 'Mumbai', authorityTitle: 'Commandant', reportDate: 'Mar 2026',
    orgNameHindi: 'संगठन बी', orgNameEnglish: 'Beta Org', formation: 'F2', command: 'C2',
  },
  {
    icNo: 'IC333333', rank: 'Lieutenant', name: 'CHARLIE DAVIS', unit: 'Gamma Unit', corps: 'Engineers',
    courseName: 'Course C', serialNo: '3', fromDate: '10/06/2026', toDate: '05/12/2026',
    knowledge: 'LOW', application: 'HIGH', penPicture: 'Charlie pen picture unique',
    courseSymbol: 'CC-3', instructionalAbility: 'EXCELLENT', grading: 'QI',
    reportNo: 'RPT-003', authorityName: 'Gen Gamma', authorityRank: 'Major General',
    station: 'Kolkata', authorityTitle: 'Commandant', reportDate: 'Jun 2026',
    orgNameHindi: 'संगठन गामा', orgNameEnglish: 'Gamma Org', formation: 'F3', command: 'C3',
  }
];

// Helper to build docxtemplater data with all fields (empty defaults)
function buildRenderData(r) {
  const base = {};
  const allFields = [
    'courseName','serialNo','fromDate','toDate','icNo','rank','name','unit','corps',
    'formation','command','apptCmpUnit','regtCrops','dateOfCommission','dateOfSeniority',
    'dateOfSubRanks','dateOfSuperannuation','concernedMS','dateOfBirth','age','dateOfMarriage',
    'dateOfTOS','dateOfTORS','tenureCMP','arrivalDateCCW',
    'height','weight','bmi','medicalCategory','diagnosis','iCardNo','warrantCardNo',
    'panCardNo','aadhaarCardNo','passportNo','cdaAcctNo','mobNo','emailId','religion',
    'bloodGroup','basicPay',
    'foodPreference','admInfo','admInfoDoc','movementOrder','movementOrderDoc','lrc','lrcDoc',
    'willingnessCert','willingnessCertDoc','medicalCert','medicalCertDoc','nominalRoll',
    'nominalRollDoc','etg','etgDoc','cyberSecurityCert','cyberSecurityCertDoc','appxFAO',
    'appxFAODoc','teiFeedback','teiFeedbackDoc','teiFeedbackPoints','admFeedback',
    'admFeedbackDoc','admFeedbackPoints','mutualAssessment','mutualAssessmentDoc',
    'withFamily','withFamilyDoc','departureDate','dateOfSORS','jainUniversitySerNo',
    'entrance','lawEnforcementTheory','trafficManagementTheory','investigationTheory',
    'lawTheory','totalTheory','theoryPercentage',
    'exAnushashan','exKabu','exNandi','exMaruVijay','exKhoj','caseStudyTrg','misc20',
    'militaryPaperTrg','totalTrgEx','trgExPercentage',
    'dsII','dsI','ocCCW','dcci','commandant','totalDS','dsPercentage',
    'totalOverall','overallPercentage',
    'knowledge','application','penPicture','courseSymbol','instructionalAbility',
    'orderOfMerit','totalOfficers','grading','remarks',
    'reportNo','authorityRank','authorityName','station','authorityTitle','reportDate',
    'orgNameHindi','orgNameEnglish',
    'lawMax','lawObt','lawEnforcementMax','lawEnforcementObt','trafficManagementMax',
    'trafficManagementObt','investigationMax','investigationObt','caseStudyMax','caseStudyObt',
    'thoughtProcessMax','thoughtProcessObt','militaryPaperMax','militaryPaperObt',
    'militarySplMax','militarySplObt','coreCompetencyMax','coreCompetencyObt',
    'weaponMax','weaponObt','mapReadingMax','mapReadingObt','practicalMax','practicalObt',
    'theoryMax','theoryObt','totalMax','totalObt',
    'professionalCompetence','verbalExpression','writtenExpression','cooperationTeamwork',
    'technicalUnderstanding','tacticalFunctioning',
    'civilQualification','militaryEducation','instrStaffAppt','postingRecord','familyDetails',
  ];
  for (const f of allFields) {
    base[f] = r[f] || '';
  }
  return base;
}

// Render each report and extract body
const bodies = [];
for (let i = 0; i < reports.length; i++) {
  const r = reports[i];
  const zip = new PizZip(templateContent);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  doc.render(buildRenderData(r));
  const buf = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });

  const resultZip = new PizZip(buf);
  const docXml = resultZip.file('word/document.xml').asText();
  const innerMatch = docXml.match(/<w:body[^>]*>([\s\S]*)<\/w:body>/);

  if (innerMatch) {
    const content = innerMatch[1];
    // Save individual rendered doc for inspection
    const singlePath = `/tmp/report_${i + 1}.xml`;
    fs.writeFileSync(singlePath, docXml);
    console.log(`Report ${i + 1} (${r.name}):`);
    console.log(`  Body length: ${content.length} chars`);
    console.log(`  Contains '${r.name}': ${content.includes(r.name)}`);
    console.log(`  Contains '${r.icNo}': ${content.includes(r.icNo)}`);
    bodies.push(content);
  } else {
    console.log(`Report ${i + 1}: NO BODY EXTRACTED!`);
  }
}

// Merge
const mergedBody = bodies.join('<w:p><w:r><w:br w:type="page"/></w:r></w:p>');
console.log('\n=== MERGED BODY CHECK ===');
console.log('Total length:', mergedBody.length);
console.log('Contains ALICE SMITH:', mergedBody.includes('ALICE SMITH'));
console.log('Contains BOB JONES:', mergedBody.includes('BOB JONES'));
console.log('Contains CHARLIE DAVIS:', mergedBody.includes('CHARLIE DAVIS'));
console.log('Contains IC111111:', mergedBody.includes('IC111111'));
console.log('Contains IC222222:', mergedBody.includes('IC222222'));
console.log('Contains IC333333:', mergedBody.includes('IC333333'));
console.log('Has ALICE before BOB:', mergedBody.indexOf('ALICE SMITH') < mergedBody.indexOf('BOB JONES'));
console.log('Has BOB before CHARLIE:', mergedBody.indexOf('BOB JONES') < mergedBody.indexOf('CHARLIE DAVIS'));

// Insert into base template
const baseZip = new PizZip(templateContent);
const baseDocXml = baseZip.file('word/document.xml').asText();
const mergedXml = baseDocXml.replace(/<w:body[^>]*>([\s\S]*)<\/w:body>/, `<w:body>${mergedBody}</w:body>`);

// Count body tags in merged XML
const bodyTagCount = (mergedXml.match(/<w:body>/g) || []).length;
console.log('\n=== FINAL XML CHECK ===');
console.log('Body tag count in merged XML:', bodyTagCount, '(should be 1)');

baseZip.file('word/document.xml', mergedXml);
const output = baseZip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.writeFileSync('/tmp/test_3reports.docx', output);
console.log('\nSaved: /tmp/test_3reports.docx (' + output.length + ' bytes)');

// Verify the output can be re-parsed as a docx
try {
  const verifyZip = new PizZip(output);
  const verifyXml = verifyZip.file('word/document.xml').asText();
  const verifyBody = verifyXml.match(/<w:body[^>]*>([\s\S]*)<\/w:body>/);
  if (verifyBody) {
    console.log('\n=== VERIFICATION ===');
    console.log('Output docx is valid and re-parsable');
    console.log('Final body contains ALICE:', verifyBody[1].includes('ALICE SMITH'));
    console.log('Final body contains BOB:', verifyBody[1].includes('BOB JONES'));
    console.log('Final body contains CHARLIE:', verifyBody[1].includes('CHARLIE DAVIS'));
  }
} catch (e) {
  console.log('\nERROR: Output cannot be re-parsed:', e.message);
}
