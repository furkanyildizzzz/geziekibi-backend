import { auth } from '../config/googleAuth';
import { google } from 'googleapis';
import fs from 'fs';

const drive = google.drive({ version: 'v3', auth });

export const uploadFileToGoogleDrive = async (filePath: string, fileName: string) => {
  const fileMetadata = { name: fileName };
  const media = { mimeType: 'image/jpeg', body: fs.createReadStream(filePath) };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id',
  });

  return response.data;
};
