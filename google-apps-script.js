// ======================================================
// Google Apps Script — Paste this into your Google Sheet
// ======================================================
//
// SETUP INSTRUCTIONS:
//
// 1. Go to https://sheets.google.com and create a new spreadsheet
//    Name it: "Zero Point Five Show — Applications"
//
// 2. In Row 1, add these column headers (A1 through L1):
//    Timestamp | First Name | Last Name | Email | Phone | City | Role | Company | LinkedIn | Question for Founders | Why Attend | Source
//
// 3. Go to Extensions → Apps Script
//
// 4. Delete any existing code and paste everything below this comment block
//
// 5. Click "Deploy" → "New deployment"
//    - Click the gear icon next to "Select type" → choose "Web app"
//    - Description: "Form submissions"
//    - Execute as: "Me"
//    - Who has access: "Anyone"
//    - Click "Deploy"
//
// 6. Authorize the script when prompted (click through the "unsafe" warning — it's your own script)
//
// 7. Copy the Web app URL and paste it into script.js replacing 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'
//
// That's it! Every form submission will now appear as a new row in your sheet.
// ======================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.phone || '',
      data.city || '',
      data.role || '',
      data.company || '',
      data.linkedin || '',
      data.question || '',
      data.why || '',
      data.source || 'main_form'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('The Zero Point Five Show — Form endpoint is active.')
    .setMimeType(ContentService.MimeType.TEXT);
}
