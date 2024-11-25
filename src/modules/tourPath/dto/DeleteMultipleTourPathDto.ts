import { IsNumber } from 'class-validator';

export class DeleteMultipleTourPathDto {
  @IsNumber({}, { each: true })
  ids: number[];
}
