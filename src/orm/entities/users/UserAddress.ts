import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { Country } from 'shared/utils/enum';
import { User } from './User';
import { BaseEntity } from '../BaseEntity';

@Entity('user_addresses')
export class UserAddress extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'secondEmail',
    nullable: true,
  })
  @Expose()
  secondEmail: string;

  @Column({ nullable: true })
  @Expose()
  website: string;

  @Column({ nullable: true })
  @Expose()
  address: string;

  @Column({ nullable: true })
  @Expose()
  city: string;

  @Column({ name: 'zipCode', nullable: true })
  @Expose()
  zipCode: string;

  @Column({
    default: 'Türkiye' as Country,
    nullable: true,
  })
  @Expose()
  country: string;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => User, (user) => user.address, { nullable: true, onDelete: 'CASCADE' })
  user: User;

  @Expose({ name: 'fullAddress' })
  get name(): string {
    return `${this.address} ${this.city}  ${this.country}`;
  }
}
