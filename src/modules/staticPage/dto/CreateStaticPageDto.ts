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
import { Language, PublishStatus, StaticPageType } from 'shared/utils/enum';
import { Image } from 'orm/entities/image/Image';

export class CreateStaticPageDto {
  @IsString({ message: 'Title is required' })
  @IsNotEmpty({ message: 'Title is required' })
  title!: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsEnum(StaticPageType, { message: 'Invalid page type' })
  pageType: StaticPageType;
}
