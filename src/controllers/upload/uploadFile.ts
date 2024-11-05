import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { CustomError } from 'utils/response/custom-error/CustomError';
import sharp from 'sharp';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryFile extends Express.Multer.File {
  buffer: Buffer;
}

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {};
