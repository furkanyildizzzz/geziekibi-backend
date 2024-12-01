import { UploadApiResponse, v2 } from 'cloudinary';
import streamifier from 'streamifier';

const uploadStream = async (buffer: Buffer, folderName: string): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = v2.uploader.upload_stream(
      {
        folder: `${process.env.NODE_ENV}/${folderName}`,
        use_filename: true,
        upload_preset: 'ml_default',
      },
      (error: Error, result: UploadApiResponse) => {
        if (result) resolve(result);
        else reject(error);
      },
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};
export default uploadStream;
