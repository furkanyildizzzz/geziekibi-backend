import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Tour } from './Tour';
import { Service } from '../service/Service';
import { ServiceType } from 'shared/utils/enum';
import { Expose } from 'class-transformer';
import { BaseEntity } from '../BaseEntity';

@Entity('tour_services')
export class TourService extends BaseEntity {
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
