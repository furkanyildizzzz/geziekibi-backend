import { NextFunction, Request, Response } from 'express';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { getRepository } from 'typeorm';
import { CustomError } from 'shared/errors/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, parentid } = req.body;

  const tourCategoryRepo = getRepository(TourCategory);

  try {
    const tourCategory = await tourCategoryRepo.findOne({ where: { name } });
    if (tourCategory) {
      const customError = new CustomError(400, 'General', `Category '${name}' already exists`);
      return next(customError);
    }

    console.log({ parentid });
    if (parentid > 0) {
      const parent = await tourCategoryRepo.findOne({ where: { id: parentid } });
      if (!parent) {
        const customError = new CustomError(400, 'General', 'Parent category not found');
        return next(customError);
      }
    }

    try {
      const newTourCategory = new TourCategory();
      newTourCategory.name = name;
      newTourCategory.description = description;
      newTourCategory.parent = await tourCategoryRepo.findOne({ where: { id: parentid } });
      await tourCategoryRepo.save(newTourCategory);
      return res.customSuccess(200, 'Category created successfully', newTourCategory);
    } catch (error) {
      const customError = new CustomError(400, 'General', `Category '${name}' can't be created`, null, error);
      return next(customError);
    }
  } catch (error) {
    const customError = new CustomError(500, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
