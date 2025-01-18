import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Matches,
  IsOptional,
  IsBoolean,
  Length,
  ValidateNested,
  Validate,
  ValidationOptions,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';
import { Type } from 'class-transformer';

// Custom Validator to enforce `true` value
function IsTrue(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isTrue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value === true; // Only allow `true`
        },
        defaultMessage(): string {
          return 'Şartları kabul etmelisiniz';
        },
      },
    });
  };
}

export class CreateContactFormDto {
  @IsString({ message: 'Ad gerekli' })
  @IsNotEmpty({ message: 'Ad boş bırakılamaz' })
  @Length(1, 50, { message: 'Ad 1 ile 50 karakter arasında olmalıdır' })
  firstName!: string;

  @IsString({ message: 'Soyad gerekli' })
  @IsNotEmpty({ message: 'Soyad boş bırakılamaz' })
  @Length(1, 50, { message: 'Soyad 1 ile 50 karakter arasında olmalıdır' })
  lastName!: string;

  @IsEmail({}, { message: 'Geçersiz email adresi' })
  email!: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9+\-\s]*$/, { message: 'Geçersiz telefon numarası formatı' })
  phone?: string;

  @IsString({ message: 'Mesaj gerekli' })
  @Length(10, 1000, {
    message: 'Mesaj 10 ile 1000 karakter arasında olmalıdır',
  })
  @Matches(/^(?!.*(script|<|>|&|{|})).*$/i, {
    message: 'Mesajda potansiyel olarak zararlı içerik bulunmaktadır',
  })
  message!: string;

  @IsBoolean({ message: 'Şartları kabul etmelisiniz' })
  @IsTrue({ message: 'Şartları kabul etmelisiniz' }) // Ensure value is strictly `true`
  agreeToTerms!: boolean;
}
