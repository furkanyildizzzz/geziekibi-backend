import { Expose, Type } from 'class-transformer';
import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { Image } from 'orm/entities/image/Image';
import { Tag } from 'orm/entities/tag/Tag';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { TourPrice } from 'orm/entities/tour/TourPrice';
import { Language } from 'orm/entities/users/types';
import { TourType } from 'shared/utils/enum';

export class BlogListDto {
  @Expose()
  id: number;
  @Expose()
  title: string;
  @Expose()
  spot: string;

  @Expose()
  language: Language;

  @Expose()
  @Type(() => BlogCategory)
  category: BlogCategory;

  @Expose()
  @Type(() => Tag)
  tags: Tag[];

  @Expose()
  @Type(() => Image)
  primaryImages: Image[];

  @Expose()
  publishStatus: string;

  @Expose()
  @Type(() => Date)
  publishDate: Date;
}
