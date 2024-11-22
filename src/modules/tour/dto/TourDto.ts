import { Expose, Type } from 'class-transformer';
import { Image } from 'orm/entities/image/Image';
import { Service } from 'orm/entities/service/Service';
import { Tag } from 'orm/entities/tag/Tag';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { TourPrice } from 'orm/entities/tour/TourPrice';
import { TourService } from 'orm/entities/tour/TourService';
import { ServiceType, TourType } from 'shared/utils/enum';

export class ServiceDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

export class TourServiceDto {
  @Expose()
  id: number;

  @Expose()
  type: ServiceType;

  @Expose({ name: 'servicee' })
  @Type(() => ServiceDto)
  servicee: ServiceDto;
}

export class TourDto {
  @Expose()
  id: number;
  @Expose()
  title: string;
  @Expose()
  spot: string;
  @Expose()
  body: string;
  @Expose()
  tourType: TourType;

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

  @Expose()
  @Type(() => TourCategory)
  category: TourCategory;

  @Expose()
  @Type(() => Tag)
  tags: Tag[];

  @Expose({ name: 'primaryImages' })
  @Type(() => Image)
  uploadedPrimaryImages: Image[];

  @Expose({ name: 'galleryImages' })
  @Type(() => Image)
  uploadedGalleryImages: Image[];

  @Expose()
  @Type(() => TourPrice)
  prices: TourPrice[];

  @Expose()
  @Type(() => TourService)
  tourServices: TourService[];
}
