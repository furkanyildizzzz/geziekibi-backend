import { Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { TourDailyPath } from 'orm/entities/tour/TourDailyPath';

export class SearchTourDto {
  @Expose()
  @Type(() => TourDailyPath)
  @IsOptional()
  destination?: TourDailyPath | null;

  @Expose()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date | null;
}
