import { Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Country } from 'shared/utils/enum';

export class UserEditProfileDto {
  @Expose()
  id: number;

  @IsOptional()
  @IsEmail()
  @Expose()
  secondEmail: string;

  @IsString({ message: 'First name is required' })
  @IsNotEmpty({ message: 'First name is required' })
  @Expose()
  firstName: string;

  @IsString({ message: 'Last name is required' })
  @IsNotEmpty({ message: 'Last name is required' })
  @Expose()
  lastName: string;

  @IsOptional()
  bio: string;

  @IsOptional()
  website: string;

  @IsOptional()
  address: string;

  @IsOptional()
  city: string;

  @IsOptional()
  zipCode: string;

  @IsOptional()
  @IsEnum(Country, {
    message: 'Country is not one of Country enum values',
  })
  country: string;
}
