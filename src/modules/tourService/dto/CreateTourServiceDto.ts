import { IsString, MinLength } from 'class-validator';

export class CreateTourServiceDto {
  @IsString()
  @MinLength(3)
  name: string;
}
