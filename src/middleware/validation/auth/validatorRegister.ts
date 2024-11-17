import { Request, Response, NextFunction } from 'express';
import { ConstsUser } from 'shared/utils/enum';
import { CustomError } from 'shared/errors/CustomError';
import { ErrorValidation } from 'shared/errors/types';
import validator from 'validator';

export const validatorRegister = (req: Request, res: Response, next: NextFunction) => {
  let { firstName, lastName, email, password, passwordConfirm } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  email = !email ? '' : email;
  password = !password ? '' : password;
  passwordConfirm = !passwordConfirm ? '' : passwordConfirm;

  if (validator.isEmpty(firstName)) errorsValidation.push({ firstName: 'First name is required' });
  if (validator.isEmpty(lastName)) errorsValidation.push({ lastName: 'Last name is required' });
  if (!validator.isEmail(email)) errorsValidation.push({ email: 'Email is invalid' });
  if (validator.isEmpty(email)) errorsValidation.push({ email: 'Email is required' });
  if (validator.isEmpty(password)) errorsValidation.push({ password: 'Password is required' });
  if (!validator.isLength(password, { min: ConstsUser.PASSWORD_MIN_CHAR }))
    errorsValidation.push({ password: `Password length must be at least ${ConstsUser.PASSWORD_MIN_CHAR} chars` });
  if (validator.isEmpty(passwordConfirm)) errorsValidation.push({ passwordConfirm: 'Password confirm is required' });
  if (!validator.equals(password, passwordConfirm))
    errorsValidation.push({ password: 'Password confirm does not match' });

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Register validation error', null, null, errorsValidation);
    return next(customError);
  }
  return next();
};
