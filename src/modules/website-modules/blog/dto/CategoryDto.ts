import { Expose, Type } from 'class-transformer';
import { Image } from 'orm/entities/image/Image';

export class CategoryDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  seoLink: string;

  @Expose()
  blogCount: number;

  @Expose()
  @Type(() => CategoryDto) // Transform the parent property
  parent: CategoryDto;

  @Expose()
  @Type(() => CategoryDto) // Transform the subCategories property
  subCategories: CategoryDto[];

  @Expose()
  @Type(() => Image)
  uploadedPrimaryImages: Image[];
}
