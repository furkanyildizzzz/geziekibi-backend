import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { PublishStatus } from 'shared/utils/enum';
import { BaseEntity } from '../BaseEntity';

@Entity('catalogs')
export class Catalog extends BaseEntity {
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

  @Column('int')
  @Expose()
  pages: number;

  @Column('int')
  @Expose()
  bytes: number;

  @Column('int', { default: 1, name: 'order' })
  @Expose()
  order: number;

  @Column({ unique: true })
  seoLink: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', name: 'createdAt' })
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: PublishStatus,
    default: PublishStatus.DRAFT,
  })
  @Expose()
  publishStatus: PublishStatus;

  @Column()
  @CreateDateColumn()
  @Expose()
  publishDate: Date;
}
