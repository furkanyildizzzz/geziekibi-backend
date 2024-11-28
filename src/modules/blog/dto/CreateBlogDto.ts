import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Language, PublishStatus } from 'shared/utils/enum';
import { Image } from 'orm/entities/image/Image';

class BlogTagDto {
  @IsNumber()
  id!: number;

  @IsOptional()
  @IsString()
  name?: string;
}

class BlogCategoryDto {
  @IsNumber()
  id!: number;

  @IsOptional()
  @IsString()
  name?: string;
}

export class CreateBlogDto {
  @IsString({ message: 'Title is required' })
  @IsNotEmpty({ message: 'Title is required' })
  title!: string;

  @IsString({ message: 'Spot is required' })
  @IsNotEmpty({ message: 'Spot is required' })
  spot!: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsEnum(Language, { message: 'Invalid language type' })
  language: Language = Language.TR;

  @IsEnum(PublishStatus, { message: 'Invalid publish status' })
  publishStatus: PublishStatus = PublishStatus.DRAFT;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid publish date format' })
  publishDate?: string;

  @IsOptional()
  @IsArray()
  primaryImages?: any[];

  @IsOptional()
  @Type(() => Image)
  uploadedPrimaryImages: Image[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlogTagDto)
  tags?: BlogTagDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => BlogCategoryDto)
  category?: BlogCategoryDto;
}
