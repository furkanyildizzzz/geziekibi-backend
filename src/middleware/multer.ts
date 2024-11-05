// middleware/multer.js
import path from 'path';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
// import DataURIParser from 'datauri/parser';

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('file');
// const dUri = new DataURIParser();
// Middleware wrapper for multer to handle `req`, `res`, and `next`
const uploadMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  multerUploads(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ message: 'File upload failed', error: err });
    }
    return next();
  });
};

/**
 * @description This function converts the buffer to data URI
 * @param {Object} req containing the field object
 * @returns {String} The data URI from the string buffer
 */
// const dataUri = (req: Request) => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

const getBase64 = (file) => '';

export { uploadMiddleware, getBase64 };
