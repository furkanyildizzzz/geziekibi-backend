import { NextFunction, Request, Response } from 'express';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';
import validator from 'validator';

const validatorTourBodyFile = (req: Request, res: Response, next: NextFunction) => {
  let files = req;

  const errorsValidation: ErrorValidation[] = [];

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
export default validatorTourBodyFile;
