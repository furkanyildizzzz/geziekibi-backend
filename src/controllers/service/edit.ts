import { NextFunction, Request, Response } from 'express';
import { Service } from 'orm/entities/service/Service';
import { getRepository } from 'typeorm';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description } = req.body;
  const id = req.params.id;

  const serviceRepo = getRepository(Service);

  try {
    const service = await serviceRepo.findOne(id);
    if (!service) {
      const customError = new CustomError(404, 'General', `Service with id:${id} not found`, ['Service not found']);
      return next(customError);
    }

    try {
      if (name !== undefined) {
        service.name = name;
      }

      if (description !== undefined) {
        service.description = description;
      }

      await serviceRepo.save(service);
      return res.customSuccess(200, 'Service successfully saved', service);
    } catch (error) {
      const customError = new CustomError(400, 'General', 'Service update error', null, error);
      return next(customError);
    }
  } catch (error) {
    const customError = new CustomError(500, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
