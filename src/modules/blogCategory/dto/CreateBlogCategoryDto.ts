import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, Min, MinLength, ValidateIf } from 'class-validator';
import { Image } from 'orm/entities/image/Image';

export class CreateBlogCategoryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id?: number; // Optional integer property

  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  description?: string; // Optional string property

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number; // Optional integer property

  @IsOptional()
  @IsArray()
  primaryImages?: any[];

  @IsOptional()
  @Type(() => Image)
  uploadedPrimaryImages: Image[];
}
