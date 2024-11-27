import { IsNumber } from 'class-validator';

export class DeleteMultipleTourDailyPathDto {
  @IsNumber({}, { each: true })
  ids: number[];
}
