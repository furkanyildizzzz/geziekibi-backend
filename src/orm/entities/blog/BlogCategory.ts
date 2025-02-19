import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { Image } from '../image/Image';
import { Blog } from './Blog';
import { BaseEntity } from '../BaseEntity';

@Entity('blog_categories')
export class BlogCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @Column({ type: 'text', nullable: true })
  @Expose()
  description: string;

  @OneToMany(() => Blog, (blog) => blog.category)
  blogs: Blog[];

  @Column({ unique: true })
  seoLink: string;

  // Self-referencing relationship to represent the master category
  @ManyToOne(() => BlogCategory, (category) => category.subCategories, { nullable: true, onDelete: 'SET NULL' })
  @Expose()
  parent: BlogCategory;

  @OneToMany(() => BlogCategory, (category) => category.parent)
  subCategories: BlogCategory[];

  @OneToMany(() => Image, (image) => image.blogCategory, { nullable: true, cascade: true })
  @Expose()
  primaryImages: Image[];
}
