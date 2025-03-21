import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tour } from './Tour';
import { Expose } from 'class-transformer';
import { TourPrice } from './TourPrice';
import { BaseEntity } from '../BaseEntity';

@Entity('tour_dates')
export class TourDate extends BaseEntity {
  @Column({ type: 'timestamp' })
  @CreateDateColumn()
  @Expose()
  startDate: Date;

  @Column({ type: 'timestamp' })
  @CreateDateColumn()
  @Expose()
  endDate: Date;

  @Column()
  @Expose()
  description: string;

  @Column({ default: true })
  @Expose()
  isActive: boolean;

  @ManyToOne(() => Tour, (tour) => tour.tourDates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tourId' })
  tour: Tour;

  @OneToMany(() => TourPrice, (price) => price.tourDate, { nullable: true, cascade: true })
  @Expose()
  prices: TourPrice[];
}
