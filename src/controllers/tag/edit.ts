import { NextFunction, Request, Response } from 'express';
import { Tag } from 'orm/entities/tag/Tag';
import { getRepository } from 'typeorm';
import { CustomError } from 'shared/errors/CustomError';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  const id = req.params.id;
  const tagRepository = getRepository(Tag);
  try {
    const tag = await tagRepository.findOne({ where: { id: Number(id) } });
    if (!tag) {
      const customError = new CustomError(404, 'General', `Tag with id:${id} not found`, ['Tag not found.']);
      return next(customError);
    }

    try {
      tag.name = name;
      await tagRepository.save(tag);

      return res.customSuccess(200, 'Tag successfully saved', tag);
    } catch (error) {
      const customError = new CustomError(400, 'General', 'Tag update error', null, error);
      return next(customError);
    }
  } catch (error) {
    const customError = new CustomError(400, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
