import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tour } from '../tour/Tour';
import { validateOrReject } from 'class-validator';
import { classToPlain, Exclude, Expose, instanceToPlain } from 'class-transformer';
import { BaseEntity } from '../BaseEntity';
import { Blog } from '../blog/Blog';

@Entity('tags')
export class Tag extends BaseEntity {
  @Column({ unique: true, nullable: false })
  @Expose()
  name: string;

  @Column({ unique: true })
  seoLink: string;

  @ManyToMany(() => Tour, (tour) => tour.tags)
  tours: Tour[];

  @ManyToMany(() => Blog, (blog) => blog.tags)
  blogs: Blog[];

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
