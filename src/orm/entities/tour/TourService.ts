import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Tour } from './Tour';
import { Service } from '../service/Service';
import { ServiceType } from './types';

@Entity('tour_services')
export class TourService {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tour, (tour) => tour.tourServices, { onDelete: 'CASCADE' })
  tour: Tour;

  @ManyToOne(() => Service, (service) => service.tourServices, { onDelete: 'CASCADE' })
  service: Service;

  @Column({
    type: 'enum',
    enum: ServiceType,
  })
  type: ServiceType;
}
