import { NextFunction, Request, Response } from 'express';
import { Service } from 'orm/entities/service/Service';
import { getRepository } from 'typeorm';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description } = req.body;

  const serviceRepo = getRepository(Service);

  try {
    const service = await serviceRepo.findOne({ where: { name } });
    if (service) {
      const customError = new CustomError(400, 'General', `Service '${name}' already exists`);
      return next(customError);
    }

    try {
      const newService = new Service();
      newService.name = name;
      newService.description = description;
      await serviceRepo.save(newService);
      return res.customSuccess(200, 'Service created successfully', newService);
    } catch (error) {
      const customError = new CustomError(400, 'General', `Service '${name}' can't be created`, null, error);
      return next(customError);
    }
  } catch (error) {
    const customError = new CustomError(500, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
