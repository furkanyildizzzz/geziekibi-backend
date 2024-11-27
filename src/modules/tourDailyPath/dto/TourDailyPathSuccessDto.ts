import { Expose } from 'class-transformer';

export class TourDailyPathSuccessDto {
  @Expose()
  public id: number;
  @Expose()
  public name: string;
}
