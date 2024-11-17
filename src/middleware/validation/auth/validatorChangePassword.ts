import { Request, Response, NextFunction } from 'express';
import { ConstsUser } from 'shared/utils/enum';
import { CustomError } from 'shared/errors/CustomError';
import { ErrorValidation } from 'shared/errors/types';
import validator from 'validator';

export const validatorChangePassword = (req: Request, res: Response, next: NextFunction) => {
  let { password, passwordNew, passwordConfirm } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  password = !password ? '' : password;
  passwordNew = !passwordNew ? '' : passwordNew;
  passwordConfirm = !passwordConfirm ? '' : passwordConfirm;

  if (validator.isEmpty(password)) errorsValidation.push({ password: 'Password field is required' });
  if (validator.isEmpty(passwordNew)) errorsValidation.push({ passwordNew: 'New Password field is required' });
  if (!validator.isLength(passwordNew, { min: ConstsUser.PASSWORD_MIN_CHAR }))
    errorsValidation.push({ passwordNew: `New Password must be at least ${ConstsUser.PASSWORD_MIN_CHAR} charecters` });
  if (validator.isEmpty(passwordConfirm))
    errorsValidation.push({ passwordConfirm: 'Confirm Password field is required' });
  if (!validator.equals(passwordNew, passwordConfirm))
    errorsValidation.push({ passwordConfirm: 'Confirm Password does not match' });

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      'Validation',
      'Change password validation error',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }
  return next();
};
