import { Expose } from 'class-transformer';
import { PublishStatus } from 'shared/utils/enum';

export class CatalogDto {
  @Expose()
  originalName: string;

  @Expose()
  publicId: string; // Cloudinary public ID

  @Expose()
  url: string;

  @Expose()
  secureUrl: string;

  @Expose()
  format: string;

  @Expose()
  width: number;

  @Expose()
  height: number;

  @Expose()
  pages: number;

  @Expose()
  bytes: number;

  @Expose()
  order: number;

  @Expose()
  publishStatus: PublishStatus;

  @Expose()
  publishDate: Date;
}
