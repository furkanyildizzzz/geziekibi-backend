import { ConstsUser } from 'consts/ConstsUser';
import { Request, Response, NextFunction } from 'express';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';
import validator from 'validator';

export const validatorChangePassword = (req: Request, res: Response, next: NextFunction) => {
  let { password, newPassword, passwordConfirm } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  password = !password ? '' : password;
  newPassword = !newPassword ? '' : newPassword;
  passwordConfirm = !passwordConfirm ? '' : passwordConfirm;

  if (validator.isEmpty(password)) errorsValidation.push({ password: 'Password field is required' });
  if (validator.isEmpty(newPassword)) errorsValidation.push({ newPassword: 'New Password field is required' });
  if (!validator.isLength(newPassword, { min: ConstsUser.PASSWORD_MIN_CHAR }))
    errorsValidation.push({ newPassword: `New Password must be at least ${ConstsUser.PASSWORD_MIN_CHAR} charecters` });
  if (validator.isEmpty(passwordConfirm))
    errorsValidation.push({ passwordConfirm: 'Confirm Password field is required' });
  if (!validator.equals(newPassword, passwordConfirm))
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
