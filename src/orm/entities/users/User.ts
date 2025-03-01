import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Language, Role } from './types';
import bcrypt from 'bcryptjs';
import { Image } from '../image/Image';
import { Exclude, Expose } from 'class-transformer';
import { UserAddress } from './UserAddress';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    default: 'STANDARD' as Role,
    length: 30,
  })
  role: string;

  @Column({
    default: 'en-US' as Language,
    length: 15,
  })
  language: string;

  @Column({ nullable: true })
  bio: string;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;

  @Column({ unique: true })
  seoLink: string;

  // One-to-Many relationship with Image (A user can upload multiple images)
  @OneToOne(() => Image, (image) => image.user, { cascade: true })
  profileImage: Image;

  @OneToOne(() => UserAddress, (address) => address.user, { cascade: true })
  @JoinColumn({ name: 'addressId' })
  address: UserAddress;

  @Expose({ name: 'fullName' })
  get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }
  setLanguage(language: Language) {
    this.language = language;
  }

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfPasswordMatch(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
