import { Expose } from 'class-transformer';
import { Image } from 'orm/entities/image/Image';
import { UserAddress } from 'orm/entities/users/UserAddress';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose({ name: 'name' })
  fullName: string;
}
