import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { INTERFACE_TYPE } from 'core/types';
import { inject } from 'inversify';
import { Image } from 'orm/entities/image/Image';
import { BadRequestException, InternalServerErrorException } from 'shared/errors/allException';
import { IImageRepository } from 'shared/interfaces/IImageRepository';
import { IImageService } from 'shared/interfaces/IImageService';
import streamifier from 'streamifier';

export class ImageService implements IImageService {
    constructor(@inject(INTERFACE_TYPE.IImageRepository) private readonly imageRepository: IImageRepository) {
    }

    private getUploadFolder(entityType: string, entityId: number): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');

        return `${process.env.NODE_ENV}/${entityType}/${year}-${month}-${day}/${entityId}`;
    }

    public async saveImages(
        entityType: string,
        entityId: number,
        images: Express.Multer.File[],
        uploadedImageIds: number[],
        relationKey: keyof Image
    ): Promise<Image[]> {
        // 📌 Eski görselleri kontrol edip sil
        const existingImages = await this.imageRepository.findAllByField(relationKey, entityId);
        const imagesToDelete = existingImages.filter(img => !uploadedImageIds.includes(img.id)).map(img => img.id);

        if (imagesToDelete.length) {
            await this.imageRepository.deleteMultiple(imagesToDelete);
        }

        // 📌 Yeni görselleri yükle
        const savedImages: Image[] = [];
        const uploadFolder = this.getUploadFolder(entityType, entityId);
        console.log({ images })
        for (const file of images) {
            try {
                const imageStr = `data:image/jpeg;base64,${file.buffer.toString('base64')}`;
                const result = await cloudinary.uploader.upload(imageStr, { folder: uploadFolder });

                const newImage = new Image();
                newImage.originalName = file.originalname;
                newImage.publicId = result.public_id;
                newImage.url = result.url;
                newImage.secureUrl = result.secure_url;
                newImage.format = result.format;
                newImage.width = result.width;
                newImage.height = result.height;
                newImage.createdAt = new Date(result.created_at);
                (newImage as any)[relationKey] = { id: entityId }; // Generic ilişkilendirme

                await this.imageRepository.create(newImage);
                savedImages.push(newImage);
            } catch (err) {
                throw new InternalServerErrorException(`image_upload_failed`, { filename: file.originalname });
            }
        }

        return savedImages;
    }

    public async uploadBodyImage(folderName: string, file: Express.Multer.File): Promise<string> {
        try {
            const imageStr = 'data:image/jpeg;base64,' + file.buffer.toString('base64');
            return await cloudinary.uploader
                .upload(imageStr, { folder: `${process.env.NODE_ENV}/${folderName}/` })
                .then((result) => {
                    const imageUrl = result.url;
                    console.log("Cloudinary Upload Success, Body Image:", { imageUrl });
                    return imageUrl;
                })
                .catch((err) => {
                    console.log("Cloudinary Upload Error:", err.message);
                    throw new InternalServerErrorException(err.message);
                });

        } catch (err) {
            throw new InternalServerErrorException(`image_upload_failed`, { filename: file.originalname });
        }
    }

    public async uploadStream(buffer: Buffer, folderName: string): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
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
}
