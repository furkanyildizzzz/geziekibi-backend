import { NextFunction, Request, Response } from 'express';
import { Service } from 'orm/entities/service/Service';
import { getRepository } from 'typeorm';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const serviceRepo = getRepository(Service);
  try {
    const service = await serviceRepo.findOne({ where: { id: Number(id) } });
    if (!service) {
      const customError = new CustomError(404, 'General', 'Not Found', [`Tour Service with id:${id} not found`]);
      return next(customError);
    }
    await serviceRepo.delete(id);
    return res.customSuccess(200, 'Tour Service successfully deleted');
  } catch (error) {
    const customError = new CustomError(400, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
export const destroyMultiple = async (req: Request, res: Response, next: NextFunction) => {
  const { ids } = req.body;
  const serviceRepo = getRepository(Service);
  console.log({ ids });
  try {
    if (ids) await serviceRepo.delete(ids);
    return res.customSuccess(200, 'Tour Services successfully deleted');
  } catch (error) {
    const customError = new CustomError(400, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
