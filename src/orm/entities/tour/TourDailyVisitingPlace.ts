import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, ManyToOne, Index } from 'typeorm';
import { TourDaily } from './TourDaily';
import { BaseEntity } from '../BaseEntity';
// TourDailyPath entity
@Entity('tour_daily_visiting_places')
export class TourDailyVisitingPlace extends BaseEntity {
  @Column()
  name: string; // Title of the daily path (e.g., "Day 1", "Day 2")

  @Index()
  @ManyToOne(() => TourDaily, (tour) => tour.dailyVisitingPlaces, { onDelete: 'CASCADE' })
  tourDaily: TourDaily; // Many daily paths belong to one tour
}
