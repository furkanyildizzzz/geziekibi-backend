import { Request, Response, NextFunction } from 'express';
import { CustomError } from 'shared/errors/CustomError';

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  return res.status(err.HttpStatusCode || 500).json(err.JSON);
};
