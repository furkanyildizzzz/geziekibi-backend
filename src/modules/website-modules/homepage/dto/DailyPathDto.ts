import { Expose, Type } from 'class-transformer';
import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { Image } from 'orm/entities/image/Image';
import { Tag } from 'orm/entities/tag/Tag';

export class DailyPathDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
