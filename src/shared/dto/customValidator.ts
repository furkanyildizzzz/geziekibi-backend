import moment from 'moment';
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export const isTime = (property: string, validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isTime',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          return typeof value === 'string' && moment(value, 'HH:mm:ss', true).isValid();
        },
        defaultMessage(validationArguments?: ValidationArguments) {
          return 'Not a valid time';
        },
      },
    });
  };
};

export const isValidNumber = (property: string, validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isValidDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: number, args: ValidationArguments) {
          console.log('value: ', typeof value);
          const regex = /^[0-9]*(\.[0-9]{0,2})?$/;
          return typeof value === 'number' && regex.test(value.toString());
        },
        defaultMessage(validationArguments?: ValidationArguments) {
          return 'Max two decimal places allowed';
        },
      },
    });
  };
};

export const isValidDate = (property: string, validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isValidDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          return typeof value === 'string' && moment(value, 'YYYY-MM-DD HH:mm:ss', true).isValid();
        },
        defaultMessage(validationArguments?: ValidationArguments) {
          return 'Not a valid date';
        },
      },
    });
  };
};

export const isValidDateRange = (property: string, validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isValidDateRange',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          return moment(value, 'YYYY-MM-DD HH:mm:ss').isAfter(relatedValue);
        },
        defaultMessage(validationArguments?: ValidationArguments) {
          return 'end date must be greater than start date';
        },
      },
    });
  };
};

export const isValidEnum = (property: string, enumType: any, validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isValidEnum',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          return typeof value === 'string' && Object.values(enumType).includes(value);
        },
        defaultMessage(validationArguments?: ValidationArguments) {
          return 'Not a valid string';
        },
      },
    });
  };
};
