import { NextFunction, Request, Response } from 'express';
import { Tag } from 'orm/entities/tag/Tag';
import { getRepository } from 'typeorm';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const tagRepository = getRepository(Tag);

  try {
    const tag = await tagRepository.findOne(id);
    if (!tag) {
      const customError = new CustomError(404, 'General', `Tag with id:${id} not found`, ['Tag not found.']);
      return next(customError);
    }

    return res.customSuccess(200, 'Tag found', tag);
  } catch (error) {
    const customError = new CustomError(400, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
