import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tour } from './Tour';
import { Expose } from 'class-transformer';
import { Currency } from 'shared/utils/enum';

@Entity('tour_prices')
export class TourPrice {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ nullable: false })
  @Expose()
  name: string;

  @Column()
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

  @ManyToOne(() => Tour, (tour) => tour.prices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tourId' })
  tour: Tour;
}
