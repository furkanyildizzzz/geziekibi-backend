import { ConstsUser } from 'consts/ConstsUser';
import { Request, Response, NextFunction } from 'express';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';
import validator from 'validator';

export const validatorRegister = (req: Request, res: Response, next: NextFunction) => {
  let { email, password, confirmPassword } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  email = !email ? '' : email;
  password = !password ? '' : password;
  confirmPassword = !confirmPassword ? '' : confirmPassword;

  if (!validator.isEmail(email)) errorsValidation.push({ email: 'Email is invalid' });
  if (!validator.isEmpty(email)) errorsValidation.push({ email: 'Email is required' });
  if (!validator.isEmpty(password)) errorsValidation.push({ password: 'Password is required' });
  if (!validator.isLength(password, { min: ConstsUser.PASSWORD_MIN_CHAR }))
    errorsValidation.push({ password: `Password length must be at least ${ConstsUser.PASSWORD_MIN_CHAR} chars` });
  if (!validator.isEmpty(confirmPassword)) errorsValidation.push({ confirmPassword: 'Confirm password is required' });
  if (!validator.equals(password, confirmPassword))
    errorsValidation.push({ password: 'Confirm password does not match' });

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Register validation error', null, null, errorsValidation);
    return next(customError);
  }
  return next();
};
