import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Tour } from '../tour/Tour';
import { User } from '../users/User';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'publicId' })
  publicId: string; // Cloudinary public ID

  @Column()
  url: string;

  @Column({ name: 'secureUrl' })
  secureUrl: string;

  @Column()
  format: string;

  @Column('int')
  width: number;

  @Column('int')
  height: number;

  @Column('int', { default: 1, name: 'order' })
  order: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', name: 'createdAt' })
  createdAt: Date;

  // One-to-Many relationship with Tour (Tour can have multiple gallery images)
  @ManyToOne(() => Tour, (tour) => tour.galleryImages, { nullable: true })
  @JoinColumn({ name: 'tourId' })
  tour: Tour;

  // Many-to-one relationship with Tour (Primary Image for a specific tour)
  @ManyToOne(() => Tour, (tour) => tour.primaryImages)
  @JoinColumn({ name: 'primaryForTourId' })
  primaryForTour: Tour;

  // Many-to-One relationship with User (Image uploaded by a user)
  @ManyToOne(() => User, (user) => user.images, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
