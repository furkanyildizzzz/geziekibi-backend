import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tour } from './Tour';
import { TourService } from './TourService';
import { Expose } from 'class-transformer';

@Entity('tourDailyPaths')
export class TourDailyPath {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ unique: true, nullable: false })
  @Expose()
  name: string;
}
