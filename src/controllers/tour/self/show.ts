import { NextFunction, Request, Response } from 'express';
import { Tour } from 'orm/entities/tour/Tour';
import { getRepository } from 'typeorm';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const tourRepo = getRepository(Tour);
    const tour = await tourRepo.findOne({
      where: { id: Number(id) },
      relations: [
        'tags',
        'prices',
        'category',
        'tourServices',
        'tourServices.service',
        'primaryImages',
        'galleryImages',
      ],
    });

    if (!tour) {
      const customError = new CustomError(404, 'General', `Tour with id:${id} not found`, ['Tour not found']);
      return next(customError);
    }

    return res.customSuccess(200, 'Tour found', tour);
  } catch (error) {
    const customError = new CustomError(400, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
