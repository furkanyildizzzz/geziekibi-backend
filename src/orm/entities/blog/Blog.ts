import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Language, PublishStatus, TourType } from 'shared/utils/enum';
import { Tag } from '../tag/Tag';
import { Image } from '../image/Image';
import { Expose } from 'class-transformer';
import { BlogCategory } from './BlogCategory';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ nullable: false })
  @Expose()
  title: string;

  @Column({ nullable: false })
  @Expose()
  spot: string;

  @Column({
    type: 'text',
  })
  @Expose()
  body: string;

  @Column({
    type: 'enum',
    enum: Language,
    default: Language.TR,
  })
  @Expose()
  language: Language;

  @Column({
    type: 'enum',
    enum: PublishStatus,
    default: PublishStatus.DRAFT,
  })
  @Expose()
  publishStatus: PublishStatus;

  @Column()
  @CreateDateColumn()
  @Expose()
  publishDate: Date;

  @Column()
  @CreateDateColumn()
  @Expose()
  created_at: Date;

  @Column()
  @CreateDateColumn()
  @Expose()
  updated_at: Date;

  @ManyToMany(() => Tag, (tag) => tag.tours, { cascade: true })
  @JoinTable()
  @Expose()
  tags: Tag[];

  // One-to-Many relationship with Image (Gallery Images)
  @OneToMany(() => Image, (image) => image.blog, { nullable: true, cascade: true })
  @Expose()
  primaryImages: Image[];

  //{ onDelete: 'SET NULL' } ensures that if a category is deleted, the category field in associated tours will be set to null rather than being deleted
  @ManyToOne(() => BlogCategory, (category) => category.blogs, { onDelete: 'SET NULL' })
  @JoinTable()
  @Expose()
  category: BlogCategory;
}
