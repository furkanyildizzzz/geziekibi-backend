import { NextFunction, Request, Response } from 'express';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { getRepository } from 'typeorm';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const tourCategoryRepo = getRepository(TourCategory);
    const tourCategory = await tourCategoryRepo.findOne({
      where: { id: Number(id) },
      relations: ['parent', 'subCategories'],
    });

    if (!tourCategory) {
      const customError = new CustomError(404, 'General', `Category with id:${id} not found`, ['Category not found']);
      return next(customError);
    }

    return res.customSuccess(200, 'Tour Category found', tourCategory);
  } catch (error) {
    const customError = new CustomError(400, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
