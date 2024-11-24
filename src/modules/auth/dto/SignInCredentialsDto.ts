import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInCredentialsDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  password: string;
}
