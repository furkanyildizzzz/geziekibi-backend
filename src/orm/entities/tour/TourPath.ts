import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tour } from '../tour/Tour';
import { TourService } from '../tour/TourService';
import { Expose } from 'class-transformer';

@Entity('tourPaths')
export class TourPath {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ unique: true, nullable: false })
  @Expose()
  name: string;
}
