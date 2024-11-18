import { Expose, Type } from 'class-transformer';

export class TourCategorySuccessDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  @Type(() => TourCategorySuccessDto) // Transform the parent property
  parent: TourCategorySuccessDto;

  //@Expose()
  @Type(() => TourCategorySuccessDto) // Transform the subCategories property
  subCategories: TourCategorySuccessDto[];
}
