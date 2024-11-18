import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateTourCategoryDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  description?: string; // Optional string property

  @IsOptional()
  @IsInt()
  parentId?: number; // Optional integer property
}
