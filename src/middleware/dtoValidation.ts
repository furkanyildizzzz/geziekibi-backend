import { Request, Response, NextFunction } from 'express';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { CustomError } from 'shared/errors/CustomError';
import { BadRequestException } from 'shared/errors/allException';
import { ErrorValidation } from 'shared/errors/types';

export const DtoValidationMiddleware = (type: any, skipMissingProperties = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoObj = plainToInstance(type, req.body);
    validate(dtoObj, { skipMissingProperties }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const errorsValidation: ErrorValidation[] = [];
        errors.forEach((err) => {
          //   errMsg[err.property] = [...(Object as any).values(err.constraints)];
          errorsValidation.push({
            [err.property]: [...(Object as any).values(err.constraints)].join(', '),
            // message: [...(Object as any).values(err.constraints)].join(', '),
          });
        });

        const badRequestError = new BadRequestException('BAD REQUEST', errorsValidation);
        return next(badRequestError);
        // res.status(400).json({
        //   statusCode: 400,
        //   success: false,
        //   message: '',
        //   error: errMsg,
        // });
      } else {
        req.body = dtoObj;
        next();
      }
    });
  };
};
