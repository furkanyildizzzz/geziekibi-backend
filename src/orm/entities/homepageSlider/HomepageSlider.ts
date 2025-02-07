import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { Image } from '../image/Image';

@Entity('homepage_sliders')
export class HomepageSlider {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  order: number;

  @Column({ nullable: true })
  @Expose()
  isActive: boolean;

  @OneToOne(() => Image, (image) => image.homepageSlider, { nullable: true, cascade: true })
  @Expose()
  image: Image;
}
