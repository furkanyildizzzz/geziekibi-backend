import { Expose, Type } from 'class-transformer';
import { Image } from 'orm/entities/image/Image';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { TourDate } from 'orm/entities/tour/TourDate';
import { TourType } from 'shared/utils/enum';

export class FeaturedTourDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  seoLink: string;

  @Expose()
  tourType: TourType;

  @Expose()
  @Type(() => Date) // Ensures date fields are serialized correctly
  startDate: Date;

  @Expose()
  @Type(() => Date)
  endDate: Date;

  @Expose()
  daysAndNights: string;

  @Expose()
  pricePerPerson: number;

  @Expose()
  @Type(() => Image)
  uploadedPrimaryImages: Image[];

  @Expose()
  @Type(() => TourDate)
  dates: TourDate[];
}

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
  @Type(() => CategoryDto) // Transform the parent property
  parent: CategoryDto;

  //@Expose()
  @Type(() => CategoryDto) // Transform the subCategories property
  subCategories: CategoryDto[];

  @Expose({ name: 'primaryImages' })
  @Type(() => Image)
  uploadedPrimaryImages: Image[];
}
