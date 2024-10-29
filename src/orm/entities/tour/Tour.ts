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
import { PublishStatus, TourType } from './types';
import { Tag } from '../tag/Tag';
import { TourPrice } from './TourPrice';
import { TourService } from './TourService';
import { TourCategory } from './TourCategory';

@Entity('tours')
export class Tour {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    type: 'text',
  })
  body: string;

  @Column({
    default: 'YURTICI' as TourType,
  })
  type: TourType;

  @Column({
    default: 'DRAFT' as PublishStatus,
  })
  publishStatus: PublishStatus;

  @Column()
  @CreateDateColumn()
  publishDate: Date;

  @Column()
  image: string;

  @Column({ type: 'simple-array' })
  gallery: string[];

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @CreateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Tag, (tag) => tag.tours, { onDelete: 'SET NULL' })
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => TourPrice, (price) => price.tour, { onDelete: 'SET NULL' })
  prices: TourPrice[];

  @ManyToMany(() => TourService)
  @JoinTable()
  includedServices: TourService[];

  @ManyToMany(() => TourService)
  @JoinTable()
  excludedServices: TourService[];

  //{ onDelete: 'SET NULL' } ensures that if a category is deleted, the category field in associated tours will be set to null rather than being deleted
  @ManyToOne(() => TourCategory, (category) => category.tours, { onDelete: 'SET NULL' })
  @JoinTable()
  category: TourCategory;
}
