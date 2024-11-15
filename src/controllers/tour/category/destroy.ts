import { NextFunction, Request, Response } from 'express';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { getRepository } from 'typeorm';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const tourCategoryRepository = getRepository(TourCategory);
  try {
    const tourCategory = await tourCategoryRepository.findOne({ where: { id: Number(id) } });
    if (!tourCategory) {
      const customError = new CustomError(404, 'General', 'Not Found', [`Category with id:${id} not found`]);
      return next(customError);
    }
    await tourCategoryRepository.delete(id);
    return res.customSuccess(200, 'Category successfully deleted');
  } catch (error) {
    const customError = new CustomError(400, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
