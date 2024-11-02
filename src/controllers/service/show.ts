import { NextFunction, Request, Response } from 'express';
import { Service } from 'orm/entities/service/Service';
import { getRepository } from 'typeorm';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const serviceRepo = getRepository(Service);
    const service = await serviceRepo.findOne(id);

    if (!service) {
      const customError = new CustomError(404, 'General', `Service with id:${id} not found`, ['Service not found']);
      return next(customError);
    }

    return res.customSuccess(200, 'Service found', service);
  } catch (error) {
    const customError = new CustomError(400, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
