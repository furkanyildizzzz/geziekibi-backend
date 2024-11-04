import { NextFunction, Request, Response } from 'express';
import { Service } from 'orm/entities/service/Service';
import { getRepository } from 'typeorm';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';
import validator from 'validator';

const validatorEditService = async (req: Request, res: Response, next: NextFunction) => {
  let { name, description } = req.body;
  const id = req.params.id;

  name = !name ? '' : name;
  description = !description ? '' : description;

  const errorsValidation: ErrorValidation[] = [];

  try {
    const serviceRepo = getRepository(Service);

    if (validator.isEmpty(name)) errorsValidation.push({ name: 'Tour Service name cannot be empty' });
    if (!validator.isLength(name, { min: 3 }))
      errorsValidation.push({ name: 'Name must be at least 3 characters length' });

    const service = await serviceRepo.findOne({ where: { name } });
    if (service && !validator.equals(String(service.id), id)) {
      errorsValidation.push({ name: `Tour Service ${name} already exists` });
    }

    if (errorsValidation.length) {
      const customError = new CustomError(
        400,
        'Validation',
        'Validation error while editing Tour Service',
        null,
        null,
        errorsValidation,
      );
      return next(customError);
    }
  } catch (error) {
    const customError = new CustomError(400, 'Raw', 'Error', null, error);
    return next(customError);
  }

  return next();
};
export default validatorEditService;
