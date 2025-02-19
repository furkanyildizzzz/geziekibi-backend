import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tour } from './Tour';
import { TourService } from './TourService';
import { Expose } from 'class-transformer';
import { BaseEntity } from '../BaseEntity';

@Entity('tour_daily_paths')
export class TourDailyPath extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ unique: true, nullable: false })
  @Expose()
  name: string;
}
