import { NextFunction, Request, Response } from 'express';
import { CustomError } from 'shared/errors/CustomError';
import { ErrorValidation } from 'shared/errors/types';
import { TourValidationSchema, TourValidationSchemaPostman } from 'zodValidations/TourValidation';

const validatorCreateTour = async (req: Request, res: Response, next: NextFunction) => {
  const { title, spot, body, type, publishStatus, publishDate, category, price } = req.body;
  // try {
  //   const result = TourValidationSchema.safeParse(req.body); // Assuming you send data in req.body

  //   if (!result.success) {
  //     // Create errorsValidation array
  //     const errorsValidation: ErrorValidation[] = [];
  //     result.error.errors.forEach((error) => {
  //       errorsValidation.push({ [error.path.join('.')]: error.message }); // Join path to create key
  //     });

  //     if (errorsValidation.length) {
  //       const customError = new CustomError(
  //         400,
  //         'Validation',
  //         'Validation error while editing tour',
  //         null,
  //         null,
  //         errorsValidation,
  //       );
  //       return next(customError);
  //     }
  //   }
  // } catch (error) {
  //   const customError = new CustomError(400, 'Raw', 'Error', null, error);
  //   return next(customError);
  // }

  return next();
};
export default validatorCreateTour;
