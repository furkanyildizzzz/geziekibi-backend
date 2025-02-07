import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Min, MinLength, ValidateIf } from 'class-validator';
import { Image } from 'orm/entities/image/Image';

export class CreateHomepageSliderDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id?: number; // Optional integer property

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  order: number; // Optional integer property

  @Type(() => Boolean) // Ensures type conversion to boolean
  @IsBoolean() // Validates that the value is a boolean
  isActive: boolean; // Boolean to indicate if the slider is active
}
