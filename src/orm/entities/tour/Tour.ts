import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PublishStatus, TourType } from 'shared/utils/enum';
import { Tag } from '../tag/Tag';
import { TourPrice } from './TourPrice';
import { TourService } from './TourService';
import { TourCategory } from './TourCategory';
import { Image } from '../image/Image';
import { Expose } from 'class-transformer';
import { TourDaily } from './TourDaily';
import { TourDate } from './TourDate';
import { BaseEntity } from '../BaseEntity';

@Entity('tours')
export class Tour extends BaseEntity {
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
    enum: TourType,
    default: TourType.YURTICI,
  })
  @Expose()
  tourType: TourType;

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
  startDate: Date;

  @Column()
  @CreateDateColumn()
  @Expose()
  endDate: Date;

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

  @Index()
  @Column({ unique: true })
  seoLink: string;

  @ManyToMany(() => Tag, (tag) => tag.tours, { cascade: true })
  @JoinTable()
  @Expose()
  tags: Tag[];

  // @OneToMany(() => TourPrice, (price) => price.tour, { nullable: true, cascade: true })
  // @Expose()
  // prices: TourPrice[];

  @OneToMany(() => TourDate, (date) => date.tour, { nullable: true, cascade: true })
  @Expose()
  dates: TourDate[];

  // One-to-Many relationship with Image (Gallery Images)
  @OneToMany(() => Image, (image) => image.tour, { nullable: true, cascade: true })
  @Expose()
  galleryImages: Image[];

  // One-to-Many relationship with Image (Gallery Images)
  @OneToMany(() => Image, (image) => image.primaryForTour, { nullable: true, cascade: true })
  @Expose()
  primaryImages: Image[];

  //{ onDelete: 'SET NULL' } ensures that if a category is deleted, the category field in associated tours will be set to null rather than being deleted
  @ManyToOne(() => TourCategory, (category) => category.tours, { onDelete: 'SET NULL' })
  @JoinTable()
  @Expose()
  category: TourCategory;

  @OneToMany(() => TourService, (tourService) => tourService.tour, { cascade: true })
  @Expose()
  tourServices: TourService[];

  @OneToMany(() => TourDaily, (dailyForm) => dailyForm.tour, { cascade: true })
  dailyForms: TourDaily[]; // A tour can have many daily paths

  @Column({
    type: 'text',
    nullable: true,
  })
  @Expose()
  importantNotes: string;
}
