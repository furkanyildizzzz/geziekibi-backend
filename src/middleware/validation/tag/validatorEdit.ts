import { NextFunction, Request, Response } from 'express';
import { Tag } from 'orm/entities/tag/Tag';
import { getRepository } from 'typeorm';
import { CustomError } from 'shared/errors/CustomError';
import { ErrorValidation } from 'shared/errors/types';
import validator from 'validator';

export const validatorEdit = async (req: Request, res: Response, next: NextFunction) => {
  let { name } = req.body;
  const id = req.params.id;
  name = !name ? '' : name;

  const errorsValidation: ErrorValidation[] = [];

  const tagRepository = getRepository(Tag);
  try {
    if (validator.isEmpty(name)) errorsValidation.push({ name: 'Name cannot be empty' });
    if (!validator.isLength(name, { min: 3 }))
      errorsValidation.push({ name: 'Name must be at least 3 characters length' });

    const tag = await tagRepository.findOne({ where: { name } });
    if (tag && !validator.equals(String(tag.id), id)) errorsValidation.push({ name: `Tag '${name}' already exist` });

    if (errorsValidation.length !== 0) {
      const customError = new CustomError(
        400,
        'Validation',
        'Update tag validation error',
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
