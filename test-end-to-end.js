const http = require('http');
const PizZip = require('pizzip');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Step 1: Read Excel and import data
const wb = XLSX.readFile(path.join(__dirname, 'public/Demo_Import_Data.xlsx'));
const ws = wb.Sheets[wb.SheetNames[0]];
const json = XLSX.utils.sheet_to_json(ws, { raw: false, defval: '' });

const LABELS = [
  'Course Name','Serial No','From Date','To Date','IC No','Rank','Name','Unit','Corps',
  'Formation','Command','Appt (Cmp Unit)','Regt / Corps','Date of Commission','Date of Seniority','Date of Sub Ranks','Date of Superannuation','Concerned MS','Date of Birth','Age','Date of Marriage','Date of TOS','Date of TORS','Tenure at CMP','Arrival Date CCW',
  'Height (CM)','Weight (KG)','BMI','Medical Category','Diagnosis','I-Card No','Warrant Card No','PAN Card No','Aadhaar Card No','Passport No','CDA Acct No','Mob No','Email ID','Religion','Blood Group','Basic Pay',
  'Food Preference','Adm Info','Movement Order','LRC','Willingness Cert','Medical Cert','Nominal Roll','ETG','Cyber Security Cert','Appx FAO','TEI Feedback','TEI Feedback Points','Adm Feedback','Adm Feedback Points','Mutual Assessment','With Family','Departure Date','Date of SORS','Jain University Ser No',
  'Entrance','Law Enforcement Theory','Traffic Management Theory','Investigation Theory','Law Theory','Total Theory','Theory %',
  'Ex-Anushashan','Ex-Kabu','Ex-Nandi','Ex-Maru Vijay','Ex-Khoj','Case Study Trg','Misc 20','Military Paper Trg','Total Trg Ex','Trg Ex %',
  'DS II','DS I','OC CCW','DCCI','Commandant','Total DS','DS %','Total Overall','Overall %',
  'Knowledge','Application','Pen Picture','Course Symbol','Instructional Ability','Order of Merit','Total Officers','Grading','Remarks',
  'Report No','Authority Rank','Authority Name','Station','Authority Title','Report Date','Organization (Hindi)','Organization (English)'
];
const KEYS = [
  'courseName','serialNo','fromDate','toDate','icNo','rank','name','unit','corps',
  'formation','command','apptCmpUnit','regtCrops','dateOfCommission','dateOfSeniority','dateOfSubRanks','dateOfSuperannuation','concernedMS','dateOfBirth','age','dateOfMarriage','dateOfTOS','dateOfTORS','tenureCMP','arrivalDateCCW',
  'height','weight','bmi','medicalCategory','diagnosis','iCardNo','warrantCardNo','panCardNo','aadhaarCardNo','passportNo','cdaAcctNo','mobNo','emailId','religion','bloodGroup','basicPay',
  'foodPreference','admInfo','movementOrder','lrc','willingnessCert','medicalCert','nominalRoll','etg','cyberSecurityCert','appxFAO','teiFeedback','teiFeedbackPoints','admFeedback','admFeedbackPoints','mutualAssessment','withFamily','departureDate','dateOfSORS','jainUniversitySerNo',
  'entrance','lawEnforcementTheory','trafficManagementTheory','investigationTheory','lawTheory','totalTheory','theoryPercentage',
  'exAnushashan','exKabu','exNandi','exMaruVijay','exKhoj','caseStudyTrg','misc20','militaryPaperTrg','totalTrgEx','trgExPercentage',
  'dsII','dsI','ocCCW','dcci','commandant','totalDS','dsPercentage','totalOverall','overallPercentage',
  'knowledge','application','penPicture','courseSymbol','instructionalAbility','orderOfMerit','totalOfficers','grading','remarks',
  'reportNo','authorityRank','authorityName','station','authorityTitle','reportDate','orgNameHindi','orgNameEnglish'
];
const labelToKey = {};
LABELS.forEach((l, i) => { labelToKey[l] = KEYS[i]; });
const records = json.map(row => {
  const rec = {};
  for (const label of Object.keys(row)) {
    const key = labelToKey[label];
    if (key) rec[key] = String(row[label]);
  }
  return rec;
});

function apiCall(method, path, body) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: 'localhost', port: 3000, path, method,
      headers: postData ? {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      } : {},
    };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function main() {
  // Step 1: Check current count
  console.log('=== STEP 1: Check current reports ===');
  const list1 = await apiCall('GET', '/api/report?perPage=100');
  console.log(`Current reports: ${list1.data.total || 0}`);

  // Step 2: Import data
  console.log('\n=== STEP 2: Import data ===');
  const importResult = await apiCall('POST', '/api/report/import', { records });
  console.log(`Import: ${importResult.data.imported} of ${records.length}, errors: ${importResult.data.errors?.length || 0}`);

  // Step 3: Check count after import
  console.log('\n=== STEP 3: Verify import ===');
  const list2 = await apiCall('GET', '/api/report?perPage=100');
  console.log(`Reports after import: ${list2.data.total || 0}`);

  // Step 4: Generate all reports
  console.log('\n=== STEP 4: Generate all reports ===');
  const genResult = await new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost', port: 3000,
      path: '/api/report/generate-all',
      method: 'POST',
    }, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        resolve({ status: res.statusCode, size: buf.length, data: buf });
      });
    });
    req.on('error', reject);
    req.end();
  });
  console.log(`Generate-all status: ${genResult.status}, size: ${genResult.size} bytes`);

  if (genResult.status === 200 && genResult.size > 100) {
    // Step 5: Analyze the generated docx
    console.log('\n=== STEP 5: Analyze generated docx ===');
    const zip = new PizZip(genResult.data);
    const docXml = zip.file('word/document.xml').asText();
    const bodyMatch = docXml.match(/<w:body[^>]*>([\s\S]*)<\/w:body>/);
    if (bodyMatch) {
      const body = bodyMatch[1];
      const uniqueNames = ['Person 001', 'Person 002', 'Person 010', 'Person 050', 'Person 100'];
      console.log('Body length:', body.length, 'chars');
      for (const name of uniqueNames) {
        console.log(`Contains ${name}:`, body.includes(name));
      }
      // Count all Person entries as a rough report count
      const nameCount = (body.match(/Person \d+/g) || []).length;
      console.log(`Total Person entries found: ${nameCount}`);

      // Check for page breaks
      const pageBreakCount = (body.match(/w:br w:type="page"/g) || []).length;
      console.log(`Page breaks found: ${pageBreakCount}`);
    }
  }

  console.log('\n=== DONE ===');
}

main().catch(err => console.error('Error:', err));
