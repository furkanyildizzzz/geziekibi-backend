import { IsNumber } from 'class-validator';

export class DeleteMultipleFaqDto {
  @IsNumber({}, { each: true })
  ids: number[];
}
