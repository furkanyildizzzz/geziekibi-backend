import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { StaticPageType } from 'shared/utils/enum';
import { Expose } from 'class-transformer';
import { BaseEntity } from '../BaseEntity';
@Entity('static_pages')
export class StaticPage extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ nullable: false })
  @Expose()
  title: string;

  @Column({
    type: 'text',
  })
  @Expose()
  body: string;

  @Column({
    type: 'enum',
    enum: StaticPageType,
  })
  @Expose()
  pageType: StaticPageType;

  @Column()
  @CreateDateColumn()
  @Expose()
  created_at: Date;

  @Column()
  @CreateDateColumn()
  @Expose()
  updated_at: Date;
}
