import { NextFunction, Request, Response } from 'express';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { getRepository } from 'typeorm';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, parentid } = req.body;
  const id = req.params.id;

  const tourCategoryRepo = getRepository(TourCategory);

  try {
    const tourCategory = await tourCategoryRepo.findOne({ where: { id: Number(id) }, relations: ['parent'] });
    if (!tourCategory) {
      const customError = new CustomError(404, 'General', `Category with id:${id} not found`, ['Category not found']);
      return next(customError);
    }
    console.log({ parentid });
    if (parentid) {
      const parent = await tourCategoryRepo.findOne({ where: { id: parentid } });
      if (!parent) {
        const customError = new CustomError(400, 'General', 'Parent category not found');
        return next(customError);
      } else if (tourCategory.id === parent.id) {
        const customError = new CustomError(400, 'General', 'Category cannot be master of itself');
        return next(customError);
      }
      tourCategory.parent = parent;
    }
    try {
      if (name !== undefined) {
        tourCategory.name = name;
      }

      if (description !== undefined) {
        tourCategory.description = description;
      }

      if (parentid === null || parentid <= 0) {
        tourCategory.parent = null;
      }

      await tourCategoryRepo.save(tourCategory);
      return res.customSuccess(200, 'Category successfully saved', tourCategory);
    } catch (error) {
      const customError = new CustomError(400, 'General', 'Category update error', null, error);
      return next(customError);
    }
  } catch (error) {
    const customError = new CustomError(500, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
