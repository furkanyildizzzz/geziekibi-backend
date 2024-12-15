import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, ManyToOne, Index } from 'typeorm';
import { TourDaily } from './TourDaily';

// TourDailyPath entity
@Entity('tourDailyVisitingPlaces')
export class TourDailyVisitingPlace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Title of the daily path (e.g., "Day 1", "Day 2")

  @Index()
  @ManyToOne(() => TourDaily, (tour) => tour.dailyVisitingPlaces, { onDelete: 'CASCADE' })
  tourDaily: TourDaily; // Many daily paths belong to one tour
}
