import { NextFunction, Request, Response } from 'express';
import { CustomError } from 'shared/errors/CustomError';
import { ErrorValidation } from 'shared/errors/types';
import validator from 'validator';

export const validatorCreateTag = (req: Request, res: Response, next: NextFunction) => {
  let { name } = req.body;
  name = !name ? '' : name;

  const errorsValidation: ErrorValidation[] = [];

  if (validator.isEmpty(name)) errorsValidation.push({ name: 'Tag name cannot be empty' });

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Tag create validation error', null, null, errorsValidation);
    return next(customError);
  }
  return next();
};
