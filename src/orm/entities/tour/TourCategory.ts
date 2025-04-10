import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tour } from './Tour';
import { Expose } from 'class-transformer';
import { Image } from '../image/Image';
import { BaseEntity } from '../BaseEntity';

@Entity('tour_categories')
export class TourCategory extends BaseEntity {
  @Column()
  @Expose()
  name: string;

  @Column({ type: 'text', nullable: true })
  @Expose()
  description: string;

  @Column({ unique: true })
  seoLink: string;

  @OneToMany(() => Tour, (tour) => tour.category)
  tours: Tour[];

  // Self-referencing relationship to represent the master category
  @ManyToOne(() => TourCategory, (category) => category.subCategories, { nullable: true, onDelete: 'SET NULL' })
  @Expose()
  parent: TourCategory;

  @OneToMany(() => TourCategory, (category) => category.parent)
  subCategories: TourCategory[];

  @OneToMany(() => Image, (image) => image.tourCategory, { nullable: true, cascade: true })
  @Expose()
  primaryImages: Image[];
}
