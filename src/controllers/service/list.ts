import { NextFunction, Request, Response } from 'express';
import { Service } from 'orm/entities/service/Service';
import { getRepository } from 'typeorm';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serviceRepo = getRepository(Service);
    const services = await serviceRepo.find();
    return res.customSuccess(200, 'Services', services);
  } catch (error) {
    const customError = new CustomError(400, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
