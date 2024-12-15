import { Expose, Type } from 'class-transformer';
import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { Image } from 'orm/entities/image/Image';
import { Service } from 'orm/entities/service/Service';
import { Tag } from 'orm/entities/tag/Tag';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { TourPrice } from 'orm/entities/tour/TourPrice';
import { TourService } from 'orm/entities/tour/TourService';
import { Language } from 'orm/entities/users/types';
import { ServiceType, TourType } from 'shared/utils/enum';

export class BlogDtoWeb {
  @Expose()
  id: number;
  @Expose()
  title: string;
  @Expose()
  spot: string;
  @Expose()
  body: string;
  @Expose()
  language: Language;

  @Expose()
  publishStatus: string;

  @Expose()
  @Type(() => Date)
  publishDate: Date;

  @Expose()
  @Type(() => BlogCategory)
  category: BlogCategory;

  @Expose()
  @Type(() => Tag)
  tags: Tag[];

  @Expose({ name: 'primaryImages' })
  @Type(() => Image)
  uploadedPrimaryImages: Image[];
}
