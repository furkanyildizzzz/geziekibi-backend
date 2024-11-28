import { Expose, Type } from 'class-transformer';
import { Image } from 'orm/entities/image/Image';

export class BlogCategorySuccessDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  @Type(() => BlogCategorySuccessDto) // Transform the parent property
  parent: BlogCategorySuccessDto;

  //@Expose()
  @Type(() => BlogCategorySuccessDto) // Transform the subCategories property
  subCategories: BlogCategorySuccessDto[];

  @Expose({ name: 'primaryImages' })
  @Type(() => Image)
  uploadedPrimaryImages: Image[];
}
