import { NextFunction, Request, Response } from 'express';
import { CustomError } from 'shared/errors/CustomError';
import { ErrorValidation } from 'shared/errors/types';
import validator from 'validator';

const validatorCreateTourCategory = (req: Request, res: Response, next: NextFunction) => {
  let { name, description, parentid } = req.body;

  name = !name ? '' : name;
  description = !description ? '' : description;
  parentid = !parentid ? '' : parentid;

  const errorsValidation: ErrorValidation[] = [];

  if (validator.isEmpty(name)) errorsValidation.push({ name: 'Category name cannot be empty' });

  if (errorsValidation.length) {
    const customError = new CustomError(
      400,
      'Validation',
      'Validation error while creating tour category',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }

  return next();
};
export default validatorCreateTourCategory;
