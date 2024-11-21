import { Expose } from 'class-transformer';

export class ServiceSuccessDto {
  @Expose()
  public id: number;
  @Expose()
  public name: string;
  @Expose()
  public description: string;
}
