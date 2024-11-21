import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Tour } from '../tour/Tour';
import { User } from '../users/User';
import { Expose } from 'class-transformer';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ name: 'originalName', nullable: true })
  @Expose()
  originalName: string;

  @Column({ name: 'publicId' })
  @Expose()
  publicId: string; // Cloudinary public ID

  @Column()
  @Expose()
  url: string;

  @Column({ name: 'secureUrl' })
  @Expose()
  secureUrl: string;

  @Column()
  @Expose()
  format: string;

  @Column('int')
  @Expose()
  width: number;

  @Column('int')
  @Expose()
  height: number;

  @Column('int', { default: 1, name: 'order' })
  @Expose()
  order: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', name: 'createdAt' })
  createdAt: Date;

  // One-to-Many relationship with Tour (Tour can have multiple gallery images)
  @ManyToOne(() => Tour, (tour) => tour.galleryImages, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tourId' })
  tour: Tour;

  // Many-to-one relationship with Tour (Primary Image for a specific tour)
  @ManyToOne(() => Tour, (tour) => tour.primaryImages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'primaryForTourId' })
  primaryForTour: Tour;

  // Many-to-One relationship with User (Image uploaded by a user)
  @ManyToOne(() => User, (user) => user.images, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
