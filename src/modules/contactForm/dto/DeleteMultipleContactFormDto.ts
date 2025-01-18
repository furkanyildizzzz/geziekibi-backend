import { IsNumber } from 'class-validator';

export class DeleteMultipleContactFormDto {
  @IsNumber({}, { each: true })
  ids: number[];
}
