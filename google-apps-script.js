/**
 * SUHAIL - Google Apps Script for Email Collection
 * 
 * SETUP:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Delete everything and paste this code
 * 4. Click Deploy → New deployment
 * 5. Type: Web app
 * 6. Execute as: Me
 * 7. Who has access: Anyone
 * 8. Deploy and copy the URL
 */

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  // Set up CORS headers
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    var name = '';
    var email = '';
    var language = 'en';
    
    // Get parameters from GET request
    if (e && e.parameter) {
      name = e.parameter.name || '';
      email = e.parameter.email || '';
      language = e.parameter.language || 'en';
    }
    
    // Or get from POST body
    if (e && e.postData && e.postData.contents) {
      try {
        var postData = JSON.parse(e.postData.contents);
        name = postData.name || name;
        email = postData.email || email;
        language = postData.language || language;
      } catch(err) {
        // If JSON parse fails, continue with GET params
      }
    }
    
    // If no email, return API status
    if (!email) {
      output.setContent(JSON.stringify({
        status: 'ok',
        message: 'Suhail API is running. Send email parameter to subscribe.'
      }));
      return output;
    }
    
    // Save to sheet
    var result = saveToSheet(name, email, language);
    output.setContent(JSON.stringify(result));
    return output;
    
  } catch (error) {
    output.setContent(JSON.stringify({
      success: false,
      message: 'Error: ' + error.toString()
    }));
    return output;
  }
}

function saveToSheet(name, email, language) {
  // Get active spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0]; // Use first sheet
  
  // Add headers if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Name', 'Email', 'Date', 'Language']);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
  }
  
  // Check for duplicate email
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] && data[i][1].toString().toLowerCase() === email.toLowerCase()) {
      return {
        success: false,
        message: 'This email is already registered.'
      };
    }
  }
  
  // Add new row
  var now = new Date();
  var dateStr = Utilities.formatDate(now, 'Asia/Riyadh', 'yyyy-MM-dd HH:mm:ss');
  
  sheet.appendRow([
    name || 'Not provided',
    email,
    dateStr,
    language
  ]);
  
  return {
    success: true,
    message: 'Successfully subscribed!'
  };
}

// Test function - run this in Apps Script to test
function testSave() {
  var result = saveToSheet('Test Name', 'test' + Date.now() + '@test.com', 'en');
  Logger.log(result);
}
