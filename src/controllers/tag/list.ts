import { NextFunction, Request, Response } from 'express';
import { Tag } from 'orm/entities/tag/Tag';
import { getRepository } from 'typeorm';
import { CustomError } from 'shared/errors/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const tagRepository = getRepository(Tag);
  try {
    const tags = await tagRepository.find();
    return res.customSuccess(200, 'List of tags', tags);
  } catch (error) {
    const customError = new CustomError(400, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
