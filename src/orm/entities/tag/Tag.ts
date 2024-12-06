import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tour } from '../tour/Tour';
import { validateOrReject } from 'class-validator';
import { classToPlain, Exclude, Expose, instanceToPlain } from 'class-transformer';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  // @Exclude({ toPlainOnly: true })
  @Expose()
  id: number;

  @Column({ unique: true, nullable: false })
  @Expose()
  name: string;

  @Column({ unique: true })
  seoLink: string;

  @ManyToMany(() => Tour, (tour) => tour.tags)
  tours: Tour[];

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
