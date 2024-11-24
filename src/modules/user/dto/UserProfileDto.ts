import { Expose } from 'class-transformer';
import { Image } from 'orm/entities/image/Image';
import { UserAddress } from 'orm/entities/users/UserAddress';

export class UserProfileDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  role: string;

  @Expose()
  language: string;

  @Expose()
  bio: string;

  @Expose({ name: 'profileImage' })
  profileImage: Image;

  @Expose({ name: 'address' })
  address: UserAddress;

  @Expose({ name: 'name' })
  fullName: string;
}
