import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tour } from './Tour';
import { Expose } from 'class-transformer';
import { Currency } from 'shared/utils/enum';
import { TourDate } from './TourDate';
import { BaseEntity } from '../BaseEntity';

@Entity('tour_prices')
export class TourPrice extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ nullable: false })
  @Expose()
  name: string;

  @Column({ nullable: true })
  @Expose()
  description: string;

  @Column('decimal')
  @Expose()
  price: number;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.TRY,
  })
  @Expose()
  currency: Currency;

  // @ManyToOne(() => Tour, (tour) => tour.prices, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'tourId' })
  // tour: Tour;

  @ManyToOne(() => TourDate, (tourDate) => tourDate.prices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tourDateId' })
  tourDate: TourDate;
}
