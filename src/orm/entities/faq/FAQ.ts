import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tour } from '../tour/Tour';
import { validateOrReject } from 'class-validator';
import { classToPlain, Exclude, Expose, instanceToPlain } from 'class-transformer';
import { BaseEntity } from '../BaseEntity';

@Entity('faqs')
export class FAQ extends BaseEntity {
  @Column({ unique: true, nullable: false })
  @Expose()
  Question: string;

  @Column()
  Answer: string;

  @Column()
  Order: number;
}
