import { Expose, Type } from 'class-transformer';
import { Image } from 'orm/entities/image/Image';

export class HomepageSliderSuccessDto {
  @Expose()
  id: number;

  @Expose()
  order: number;

  @Expose()
  isActive: boolean;

  @Expose({ name: 'image' })
  @Type(() => Image)
  image: Image;
}
