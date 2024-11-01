import { NextFunction, Request, Response } from 'express';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { getRepository } from 'typeorm';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';
import validator from 'validator';

const validatorEditTourCategory = async (req: Request, res: Response, next: NextFunction) => {
  let { name, description, parentid } = req.body;
  const id = req.params.id;

  name = !name ? '' : name;
  description = !description ? '' : description;
  parentid = !parentid ? '' : parentid;

  const errorsValidation: ErrorValidation[] = [];

  try {
    const tourCategoryRepo = getRepository(TourCategory);

    if (validator.isEmpty(name)) errorsValidation.push({ name: 'Category name cannot be empty' });
    if (!validator.isLength(name, { min: 3 }))
      errorsValidation.push({ name: 'Name must be at least 3 characters length' });

    const tourCategory = await tourCategoryRepo.findOne({ where: { name } });
    if (tourCategory && !validator.equals(String(tourCategory.id), id)) {
      errorsValidation.push({ name: `Category ${name} already exists` });
    }

    if (errorsValidation.length) {
      const customError = new CustomError(
        400,
        'Validation',
        'Validation error while editing tour category',
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
export default validatorEditTourCategory;
