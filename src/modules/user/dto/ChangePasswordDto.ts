import {
  Equals,
  IsString,
  Matches,
  MinLength,
  registerDecorator,
  Validate,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: 'New password must be a string.' })
  @MinLength(8, { message: 'Be at least 8 characters long.' })
  @Matches(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
  @Matches(/[0-9]/, { message: 'Contain at least one number.' })
  @Matches(/[^a-zA-Z0-9]/, {
    message: 'Contain at least one special character.',
  })
  newPassword: string;

  @IsString({ message: 'Confirmation password must be a string.' })
  @Validate(Match, ['newPassword'], {
    message: "Passwords don't match.",
  })
  confirmNewPassword: string;
}

function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
      },
    });
  };
}
