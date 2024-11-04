import { Request, Response } from 'express';
import { uploadFileToGoogleDrive } from '../../services/googleDriveService';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { path, filename } = req.file;
    const googleDriveFile = await uploadFileToGoogleDrive(path, filename);

    return res.status(200).json({
      message: 'File uploaded successfully to Google Drive',
      fileId: googleDriveFile.id,
    });
  } catch (error) {
    return res.status(500).json({ message: 'File upload failed', error });
  }
};
