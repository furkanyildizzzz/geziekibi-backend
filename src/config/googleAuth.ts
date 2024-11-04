// import { google } from 'googleapis';
// import path from 'path';
// import fs from 'fs';

// const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// const auth = new google.auth.OAuth2();
// const TOKEN_PATH = path.join(__dirname, '../../token.json');

// const setAuthCredentials = async () => {
//   // auth.setCredentials({
//   //   client_id: process.env.GOOOGLE_CLIENT_ID,
//   //   client_secret: process.env.GOOOGLE_CLIENT_SECRET,
//   //   redirect_uri: process.env.GOOGLE_DRIVE_REDIRECT_URI,
//   // });

//   auth._clientId = process.env.GOOOGLE_CLIENT_ID;
//   auth._clientSecret = process.env.GOOOGLE_CLIENT_SECRET;

//   if (fs.existsSync(TOKEN_PATH)) {
//     const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
//     auth.setCredentials(token);
//   }
// };

// export { auth, setAuthCredentials };
