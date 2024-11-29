import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { StaticPageType } from 'shared/utils/enum';
import { Expose } from 'class-transformer';

@Entity('staticPages')
export class StaticPage {
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
