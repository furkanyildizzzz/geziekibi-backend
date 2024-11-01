import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PublishStatus, TourCategory } from './types';
import { Tag } from '../tag/Tag';
import { TourPrice } from './TourPrice';
import { TourService } from './TourService';

@Entity('tours')
export class Tour {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  spot: string;

  @Column({
    type: 'text',
  })
  body: string;

  @Column({
    default: 'YURTICI' as TourCategory,
  })
  category: TourCategory;

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

  @ManyToMany(() => Tag, (tag) => tag.tours, { cascade: true })
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => TourPrice, (price) => price.tour, { cascade: true })
  prices: TourPrice[];

  @ManyToMany(() => TourService)
  @JoinTable()
  includedServices: TourService[];

  @ManyToMany(() => TourService)
  @JoinTable()
  excludedServices: TourService[];
}
