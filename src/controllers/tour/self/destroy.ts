import { NextFunction, Request, Response } from 'express';
import { Tour } from 'orm/entities/tour/Tour';
import { getRepository } from 'typeorm';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const tourRepository = getRepository(Tour);
  try {
    const tourCategory = await tourRepository.findOne({ where: { id: Number(id) } });
    if (!tourCategory) {
      const customError = new CustomError(404, 'General', 'Not Found', [`Tour with id:${id} not found`]);
      return next(customError);
    }
    await tourRepository.delete(id);
    return res.customSuccess(200, 'Tour successfully deleted');
  } catch (error) {
    const customError = new CustomError(400, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
