import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tour } from './Tour';

@Entity('tour_categories')
export class TourCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => Tour, (tour) => tour.category)
  tours: Tour[];

  // Self-referencing relationship to represent the master category
  @ManyToOne(() => TourCategory, (category) => category.subCategories, { nullable: true, onDelete: 'SET NULL' })
  parent: TourCategory;

  @OneToMany(() => TourCategory, (category) => category.parent)
  subCategories: TourCategory[];
}
