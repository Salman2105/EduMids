// // Utility for uploading PDFs to Google Drive
// // Requires googleapis package and service account credentials
// const { google } = require('googleapis');
// const fs = require('fs');
// const path = require('path');

// const CREDENTIALS_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || path.join(__dirname, '../config/google-service-account.json');
// const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || null;

// function getDriveClient() {
//   const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
//   const auth = new google.auth.GoogleAuth({
//     credentials,
//     scopes: ['https://www.googleapis.com/auth/drive.file'],
//   });
//   return google.drive({ version: 'v3', auth });
// }

// async function uploadPDFToDrive(filePath, filename) {
//   const drive = getDriveClient();
//   const fileMetadata = {
//     name: filename,
//     mimeType: 'application/pdf',
//     parents: GOOGLE_DRIVE_FOLDER_ID ? [GOOGLE_DRIVE_FOLDER_ID] : undefined,
//   };
//   const media = {
//     mimeType: 'application/pdf',
//     body: fs.createReadStream(filePath),
//   };
//   const response = await drive.files.create({
//     resource: fileMetadata,
//     media,
//     fields: 'id,webViewLink,webContentLink',
//   });
//   // Make file public (optional)
//   await drive.permissions.create({
//     fileId: response.data.id,
//     requestBody: { role: 'reader', type: 'anyone' },
//   });
//   return response.data.webContentLink || response.data.webViewLink;
// }

// module.exports = { uploadPDFToDrive };