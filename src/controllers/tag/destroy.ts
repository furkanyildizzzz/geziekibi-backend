import { NextFunction, Request, Response } from 'express';
import { Tag } from 'orm/entities/tag/Tag';
import { getRepository } from 'typeorm';
import { CustomError } from 'shared/errors/CustomError';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const tagRepository = getRepository(Tag);
  try {
    const tag = await tagRepository.findOne({ where: { id: Number(id) } });
    if (!tag) {
      const customError = new CustomError(404, 'General', 'Not Found', [`Tag with id:${id} not found`]);
      return next(customError);
    }
    await tagRepository.delete(id);
    return res.customSuccess(200, 'Tag successfully deleted');
  } catch (error) {
    const customError = new CustomError(400, 'Raw', 'Error', null, error);
    return next(customError);
  }
};

export const destroyMultiple = async (req: Request, res: Response, next: NextFunction) => {
  const { ids } = req.body;
  const tagRepository = getRepository(Tag);
  console.log({ ids });
  try {
    if (ids) await tagRepository.delete(ids);
    return res.customSuccess(200, 'Tags successfully deleted');
  } catch (error) {
    const customError = new CustomError(400, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
