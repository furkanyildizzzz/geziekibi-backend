import { NextFunction, Request, Response } from 'express';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { getRepository } from 'typeorm';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tourCategoryRepo = getRepository(TourCategory);
    const tourCategories = (await tourCategoryRepo.find({ relations: ['parent'] })).sort(
      (a, b) => a.parent?.id - b.parent?.id,
    );
    return res.customSuccess(200, 'Tour Categories', tourCategories);
  } catch (error) {
    const customError = new CustomError(400, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
