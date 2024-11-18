import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpCredentialsDto {
  @IsString()
  @MinLength(1)
  firstName: string;

  @IsString()
  @MinLength(1)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(10)
  password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(10)
  passwordConfirm: string;
}
