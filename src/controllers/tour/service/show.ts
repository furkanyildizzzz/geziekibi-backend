import { NextFunction, Request, Response } from 'express';
import { Service } from 'orm/entities/service/Service';
import { getRepository } from 'typeorm';
import { CustomError } from 'shared/errors/CustomError';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const serviceRepo = getRepository(Service);
    const service = await serviceRepo.findOne({ where: { id: Number(id) } });

    if (!service) {
      const customError = new CustomError(404, 'General', `Tour Service with id:${id} not found`, [
        'Service not found',
      ]);
      return next(customError);
    }

    return res.customSuccess(200, 'Tour Service found', service);
  } catch (error) {
    const customError = new CustomError(400, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
