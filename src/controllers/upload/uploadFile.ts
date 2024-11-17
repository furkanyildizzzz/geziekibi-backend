import { NextFunction, Request, Response } from 'express';
import { CustomError } from 'shared/errors/CustomError';
import { v2 } from '../../config/cloudinaryConfig';

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  if (req.files) {
    console.log('I am here!');
    const uploadStr = 'data:image/jpeg;base64,' + req.files['file'][0].buffer.toString('base64');
    console.log('CLOUDINARY_APICLOUDINARY_API_SECRET_KEY:', process.env.CLOUDINARY_API_SECRET);
    return v2.uploader
      .upload(uploadStr, { folder: 'tour/body' })
      .then((result) => {
        const imageUrl = result.url;
        return res.customSuccess(200, 'Your image has been uploaded successfully to Cloudinary', { imageUrl });
      })
      .catch((err) => {
        const customError = new CustomError(
          500,
          'General',
          'Something went wrong while uploading to cloudinary',
          null,
          err,
        );
        return next(customError);
      });
  }
};
