import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tour } from '../tour/Tour';
import { TourService } from '../tour/TourService';
import { Expose } from 'class-transformer';
import { BaseEntity } from '../BaseEntity';

@Entity('services')
export class Service extends BaseEntity {
  @Column({ unique: true, nullable: false })
  @Expose()
  name: string;

  @Column({ nullable: true })
  @Expose()
  description: string;

  @OneToMany(() => TourService, (tourService) => tourService.service)
  tourServices: TourService[];
}
