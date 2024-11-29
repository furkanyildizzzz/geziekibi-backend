import { Expose, Type } from 'class-transformer';
import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { Image } from 'orm/entities/image/Image';
import { Tag } from 'orm/entities/tag/Tag';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { TourPrice } from 'orm/entities/tour/TourPrice';
import { Language } from 'orm/entities/users/types';
import { StaticPageType, TourType } from 'shared/utils/enum';

export class StaticPageListDto {
  @Expose()
  id: number;
  @Expose()
  title: string;
  @Expose()
  pageType: StaticPageType;
}
