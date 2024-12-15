import { Expose, Type } from 'class-transformer';
import { Image } from 'orm/entities/image/Image';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { TourPrice } from 'orm/entities/tour/TourPrice';
import { TourType } from 'shared/utils/enum';

export class TourListDtoWeb {
  @Expose()
  id: number;
  @Expose()
  title: string;
  @Expose()
  spot: string;

  @Expose()
  tourType: TourType;

  @Expose()
  @Type(() => TourCategory)
  category: TourCategory;

  @Expose()
  @Type(() => Image)
  primaryImages: Image[];

  @Expose()
  @Type(() => TourPrice)
  prices: TourPrice[];

  @Expose()
  publishStatus: string;

  @Expose()
  @Type(() => Date) // Ensures date fields are serialized correctly
  startDate: Date;

  @Expose()
  @Type(() => Date)
  endDate: Date;

  @Expose()
  @Type(() => Date)
  publishDate: Date;
}
