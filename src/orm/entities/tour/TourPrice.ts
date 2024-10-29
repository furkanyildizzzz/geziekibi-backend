import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Currency } from './types';
import { Tour } from './Tour';

@Entity('tour_prices')
export class TourPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column()
  description: string;

  @Column('decimal')
  price: number;

  @Column({ default: 'TRY' as Currency })
  currency: Currency;

  @ManyToOne(() => Tour, (tour) => tour.prices)
  tour: Tour;
}
