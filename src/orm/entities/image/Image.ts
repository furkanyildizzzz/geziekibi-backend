import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { Tour } from '../tour/Tour';
import { User } from '../users/User';
import { Expose } from 'class-transformer';
import { TourCategory } from '../tour/TourCategory';
import { BlogCategory } from '../blog/BlogCategory';
import { Blog } from '../blog/Blog';
import { HomepageSlider } from '../homepageSlider/HomepageSlider';
import { BaseEntity } from '../BaseEntity';

@Entity('images')
export class Image extends BaseEntity {
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
  @OneToOne(() => User, (user) => user.profileImage, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // One-to-Many relationship with Tour (Tour can have multiple gallery images)
  @ManyToOne(() => TourCategory, (tourCategory) => tourCategory.primaryImages, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tourCategoryId' })
  tourCategory: TourCategory;

  @ManyToOne(() => BlogCategory, (blogCategory) => blogCategory.primaryImages, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogCategoryId' })
  blogCategory: BlogCategory;

  // Many-to-one relationship with Tour (Primary Image for a specific tour)
  @ManyToOne(() => Blog, (blog) => blog.primaryImages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogId' })
  blog: Blog;

  // Many-to-One relationship with User (Image uploaded by a user)
  @OneToOne(() => HomepageSlider, (homepageSlider) => homepageSlider.image, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'homepageSliderId' })
  homepageSlider: HomepageSlider;
}
