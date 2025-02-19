import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tour } from './Tour';
import { TourService } from './TourService';
import { Expose } from 'class-transformer';
import { TourDailyVisitingPlace } from './TourDailyVisitingPlace';
import { TourDailyPath } from './TourDailyPath';
import { BaseEntity } from '../BaseEntity';

@Entity('tour_dailies')
export class TourDaily extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Tour name

  @Column('text')
  breakfeast: string; // Text input for breakfast

  @Column('text')
  lunch: string; // Text input for lunch

  @Column('text')
  dinner: string; // Text input for dinner

  @Column('text')
  description: string; // General description of the tour

  @ManyToMany(() => TourDailyPath)
  @JoinTable()
  dailyPaths: TourDailyPath[]; // Users can select many from dropdown

  @OneToMany(() => TourDailyVisitingPlace, (dailyVisitingPlace) => dailyVisitingPlace.tourDaily, {
    cascade: true,
  })
  dailyVisitingPlaces: TourDailyVisitingPlace[]; // Users can add as many daily paths as they want

  @Index()
  @ManyToOne(() => Tour, (tour) => tour.dailyForms, { onDelete: 'CASCADE' })
  tour: Tour; // Each daily path belongs to one tour
}
