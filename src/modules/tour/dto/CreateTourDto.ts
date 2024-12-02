import {
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
  IsDateString,
  IsArray,
  ValidateNested,
  IsPositive,
  IsEmpty,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PublishStatus, ServiceType, TourType } from 'shared/utils/enum';
import { Image } from 'orm/entities/image/Image';
import { TourDailyVisitingPlace } from 'orm/entities/tour/TourDailyVisitingPlace';

class TourDateDto {
  @IsOptional()
  @IsDateString({}, { message: 'Invalid tour date format' })
  tourDate?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourPriceDto)
  prices?: TourPriceDto[];
}

class TourPriceDto {
  @IsString({ message: 'Price name required' })
  @MinLength(1, { message: 'Price name required' })
  name!: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be positive' })
  price!: number;

  @IsString({ message: 'Currency is required' })
  @MinLength(1, { message: 'Currency is required' })
  currency!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

class TourTagDto {
  @IsNumber()
  id!: number;
}

class TourCategoryDto {
  @IsNumber()
  id!: number;

  @IsOptional()
  @IsString()
  name?: string;
}

class ServiceDto {
  @IsNumber()
  id!: number;

  @IsString({ message: 'Service name is required' })
  @MinLength(1, { message: 'Service name is required' })
  name!: string;

  @IsString()
  description!: string;
}

class TourServiceDto {
  @IsNumber()
  id!: number;

  @IsEnum(ServiceType, { message: 'Service type required' })
  type!: ServiceType;

  @ValidateNested()
  @Type(() => ServiceDto)
  service!: ServiceDto;
}

class TourPathDto {
  @IsNumber()
  id!: number;

  @IsOptional()
  @IsString()
  name?: string;
}

class TourDailyVisitingPlaceDto {
  @IsOptional()
  @IsString()
  name?: string;
}

class TourDailyDto {
  @IsOptional()
  @IsString()
  breakfeast: string;

  @IsOptional()
  @IsString()
  lunch: string;

  @IsOptional()
  @IsString()
  dinner: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourPathDto)
  dailyPaths?: TourPathDto[];

  @IsArray()
  @IsOptional()
  dailyVisitingPlaces?: TourDailyVisitingPlaceDto[];
}

export class CreateTourDto {
  @IsString({ message: 'Title is required' })
  @IsNotEmpty({ message: 'Title is required' })
  title!: string;

  @IsString({ message: 'Spot is required' })
  @IsNotEmpty({ message: 'Spot is required' })
  spot!: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsEnum(TourType, { message: 'Invalid tour type' })
  tourType: TourType = TourType.YURTICI;

  @IsEnum(PublishStatus, { message: 'Invalid publish status' })
  publishStatus: PublishStatus = PublishStatus.DRAFT;

  @IsDateString({}, { message: 'Invalid start date format' })
  startDate!: string;

  @IsDateString({}, { message: 'Invalid end date format' })
  endDate!: string;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid publish date format' })
  publishDate?: string;

  @IsOptional()
  @IsArray()
  primaryImages?: any[];

  @IsOptional()
  @IsArray()
  galleryImages?: any[];

  @IsOptional()
  @Type(() => Image)
  uploadedPrimaryImages: Image[];

  @IsOptional()
  @Type(() => Image)
  uploadedGalleryImages: Image[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourTagDto)
  tags?: TourTagDto[];

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => TourPriceDto)
  // prices?: TourPriceDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourDateDto)
  dates?: TourDateDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => TourCategoryDto)
  category?: TourCategoryDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourServiceDto)
  tourServices!: TourServiceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourDailyDto)
  dailyForms!: TourDailyDto[];
}
