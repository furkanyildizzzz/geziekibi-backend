import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { Image } from '../image/Image';
import { BaseEntity } from '../BaseEntity';

@Entity('homepage_sliders')
export class HomepageSlider extends BaseEntity {
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
