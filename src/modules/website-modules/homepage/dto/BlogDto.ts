import { Expose, Type } from 'class-transformer';
import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { Image } from 'orm/entities/image/Image';
import { Tag } from 'orm/entities/tag/Tag';

export class BlogDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  seoLink: string;

  @Expose()
  @Type(() => Date) // Ensures date fields are serialized correctly
  publishDate: Date;

  @Expose()
  comments: number;

  @Expose()
  @Type(() => Image)
  uploadedPrimaryImages: Image[];

  @Expose()
  @Type(() => Tag)
  tags: Tag[];

  @Expose()
  @Type(() => BlogCategory)
  category: BlogCategory;
}
