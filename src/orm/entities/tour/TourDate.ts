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

@Entity('tourDates')
export class TourDate {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @CreateDateColumn()
  @Expose()
  tourDate: Date;

  @Column()
  @Expose()
  description: string;

  @Column({ default: true })
  @Expose()
  isActive: boolean;

  @ManyToOne(() => Tour, (tour) => tour.dates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tourId' })
  tour: Tour;

  @OneToMany(() => TourPrice, (price) => price.tourDate, { nullable: true, cascade: true })
  @Expose()
  prices: TourPrice[];
}
