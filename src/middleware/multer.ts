import path from 'path';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { asyncLocalStorage } from 'orm/subscribers/auditSubscriber';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'file') {
    // if uploading resume
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      // check file type to be pdf, doc, or docx
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  } else if (file.fieldname === 'catalogFile') {
    // if uploading catalog
    if (file.mimetype === 'application/pdf') {
      // check file type to be pdf
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  } else {
    // else uploading image
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/webp'
    ) {
      // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  }
};

const multerUploads = multer({ storage, fileFilter: fileFilter }).fields([
  { name: 'file', maxCount: 1 },
  { name: 'catalogFile', maxCount: 1 },
  { name: 'profileImage', maxCount: 1 },
  { name: 'homepageSlider', maxCount: 1 },
  { name: 'tourBodyImage', maxCount: 1 },
  { name: 'primaryImages', maxCount: 1 },
  { name: 'galleryImages', maxCount: 5 },
  { name: 'uploadBodyImage', maxCount: 1 },
]);

// const multerUploads = multer({ storage, fileFilter: fileFilter }).any();

const uploadMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const store = asyncLocalStorage.getStore(); // Bağlamı al

  multerUploads(req, res, (err: any) => {
    asyncLocalStorage.run(store, () => { // Bağlamı tekrar başlat
      if (err) {
        return res.status(400).json({ message: 'File upload failed', error: err });
      }
      return next();
    });
  });
};


export { uploadMiddleware };
