import { Expose, Type } from 'class-transformer';
import { Image } from 'orm/entities/image/Image';
import { Service } from 'orm/entities/service/Service';
import { Tag } from 'orm/entities/tag/Tag';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { TourDate } from 'orm/entities/tour/TourDate';
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

class TourPathDto {
  @Expose()
  id!: number;

  @Expose()
  name?: string;
}

class TourDailyVisitingPlaceDto {
  @Expose()
  id!: number;

  @Expose()
  name?: string;
}

class TourDailyDto {
  @Expose()
  id!: number;

  @Expose()
  breakfeast: string;

  @Expose()
  lunch: string;

  @Expose()
  dinner: string;

  @Expose()
  description?: string;

  @Expose()
  @Type(() => TourPathDto)
  dailyPaths?: TourPathDto[];

  @Expose()
  @Type(() => TourDailyVisitingPlaceDto)
  dailyVisitingPlaces?: TourDailyVisitingPlaceDto[];
}

export class TourDtoWeb {
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
  daysAndNights: string;

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
  @Type(() => TourDate)
  dates: TourDate[];

  @Expose()
  @Type(() => TourService)
  tourServices: TourService[];

  @Expose()
  @Type(() => TourDailyDto)
  dailyForms: TourDailyDto[];

  @Expose()
  importantNotes: string;
}
