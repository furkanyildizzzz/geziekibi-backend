import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { isTime } from '../../../shared/dto/customValidator.js';

export class TagCreateDto {
  @IsString()
  @MinLength(3)
  name: string;
}
