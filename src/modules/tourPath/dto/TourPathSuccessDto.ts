import { Expose } from 'class-transformer';

export class TourPathSuccessDto {
  @Expose()
  public id: number;
  @Expose()
  public name: string;
}
