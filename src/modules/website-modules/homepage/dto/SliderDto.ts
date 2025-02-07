import { Expose, Type } from 'class-transformer';
import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { Image } from 'orm/entities/image/Image';
import { Tag } from 'orm/entities/tag/Tag';

export class SliderDto {
  @Expose()
  id: number;

  @Expose()
  isActive: boolean;

  @Expose()
  order: number;

  @Expose()
  @Type(() => Image) // Ensures date fields are serialized correctly
  image: Image;
}
