import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Tour } from './Tour';
import { Service } from '../service/Service';
import { ServiceType } from 'shared/utils/enum';
import { Expose } from 'class-transformer';

@Entity('tour_services')
export class TourService {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @ManyToOne(() => Tour, (tour) => tour.tourServices, { onDelete: 'CASCADE' })
  tour: Tour;

  @ManyToOne(() => Service, (service) => service.tourServices, { onDelete: 'CASCADE' })
  @Expose()
  service: Service;

  @Column({
    type: 'enum',
    enum: ServiceType,
  })
  @Expose()
  type: ServiceType;
}
export default TourService;
