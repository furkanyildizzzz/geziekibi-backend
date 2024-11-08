import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Tour } from '../tour/Tour';
import { User } from '../users/User';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  public_id: string; // Cloudinary public ID

  @Column()
  url: string;

  @Column()
  secure_url: string;

  @Column()
  format: string;

  @Column('int')
  width: number;

  @Column('int')
  height: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // One-to-Many relationship with Tour (Tour can have multiple gallery images)
  @ManyToOne(() => Tour, (tour) => tour.galleryImages, { nullable: true })
  tour: Tour;

  // Many-to-one relationship with Tour (Primary Image for a specific tour)
  @ManyToOne(() => Tour, (tour) => tour.primaryImages)
  primaryForTour: Tour;

  // Many-to-One relationship with User (Image uploaded by a user)
  @ManyToOne(() => User, (user) => user.images, { nullable: true })
  user: User;
}
