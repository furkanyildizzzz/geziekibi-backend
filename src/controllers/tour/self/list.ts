import { NextFunction, Request, Response } from 'express';
import { Tour } from 'orm/entities/tour/Tour';
import { getRepository } from 'typeorm';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tourRepo = getRepository(Tour);
    const tours = (await tourRepo.find({ relations: ['tags', 'prices', 'category', 'tourServices'] })).sort(
      (a, b) => a.id - b.id,
    );
    return res.customSuccess(200, 'Tours', tours);
  } catch (error) {
    const customError = new CustomError(400, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
