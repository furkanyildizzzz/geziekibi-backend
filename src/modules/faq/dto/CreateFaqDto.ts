import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  @MinLength(3)
  Question: string;

  @IsString()
  Answer: string;

  @IsNumber()
  Order: number;
}
