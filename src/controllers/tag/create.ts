import { NextFunction, Request, Response } from 'express';
import { Tag } from 'orm/entities/tag/Tag';
import { getRepository } from 'typeorm';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  const tagRepo = getRepository(Tag);

  try {
    const tag = await tagRepo.findOne({ where: { name } });
    if (tag) {
      const customError = new CustomError(400, 'General', `Tag '${name}' already exists`);
      return next(customError);
    }

    try {
      const newTag = new Tag();
      newTag.name = name;
      await tagRepo.save(newTag);
      return res.customSuccess(200, 'Tag created successfully', newTag);
    } catch (error) {
      const customError = new CustomError(400, 'General', `Tag '${name}' can't be created`, null, error);
      return next(customError);
    }
  } catch (error) {
    const customError = new CustomError(400, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
