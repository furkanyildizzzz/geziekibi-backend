import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.TRY,
  })
  currency: Currency;

  @ManyToMany(() => Tour, (tour) => tour.prices)
  tour: Tour[];
}
