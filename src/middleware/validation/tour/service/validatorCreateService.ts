import { NextFunction, Request, Response } from 'express';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';
import validator from 'validator';

const validatorCreateService = (req: Request, res: Response, next: NextFunction) => {
  let { name, description } = req.body;

  name = !name ? '' : name;
  description = !description ? '' : description;

  const errorsValidation: ErrorValidation[] = [];

  if (validator.isEmpty(name)) errorsValidation.push({ name: 'Tour Service name cannot be empty' });

  if (errorsValidation.length) {
    const customError = new CustomError(
      400,
      'Validation',
      'Validation error while creating service',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }

  return next();
};
export default validatorCreateService;
