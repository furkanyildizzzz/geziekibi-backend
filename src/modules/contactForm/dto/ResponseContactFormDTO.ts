import { IsString, MinLength } from 'class-validator';

export class ResponseContactFormDTO {
  @IsString()
  @MinLength(3)
  response: string;
}
