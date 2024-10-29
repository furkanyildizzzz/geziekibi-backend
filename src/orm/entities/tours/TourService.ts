import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tour_services')
export class TourService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
