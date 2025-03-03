import { UploadApiResponse } from "cloudinary";
import { Catalog } from "orm/entities/catalog/Catalog";
import { Image } from "orm/entities/image/Image";

export interface IImageService {
  saveImages(
    entityType: string,
    entityId: number,
    images: Express.Multer.File[],
    uploadedImageIds: number[],
    relationKey: keyof Image
  ): Promise<Image[]>

  uploadBodyImage(folderName: string, file: Express.Multer.File): Promise<string>
  uploadStream(buffer: Buffer, folderName: string): Promise<UploadApiResponse>
}