import { Request, Response, NextFunction } from 'express';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { CustomError } from 'shared/errors/CustomError';
import { BadRequestException } from 'shared/errors/allException';
import { ErrorValidation } from 'shared/errors/types';
import { buffer } from 'stream/consumers';

export const DtoValidationMiddleware = (type: any, skipMissingProperties = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if the content type is form-data (Multer parses this as plain objects)
    const contentType = req.headers['content-type'];
    const isFormData = contentType && contentType.includes('multipart/form-data');
    if (isFormData) {
      const parseFields = [
        'tags',
        'prices',
        'category',
        'dates',
        'tourServices',
        'uploadedGalleryImages',
        'uploadedPrimaryImages',
        'dailyForms',
      ];
      parseFields.forEach((field) => {
        if (req.body[field]) {
          try {
            req.body[field] = JSON.parse(req.body[field]);
          } catch (err) {
            throw new Error(`Invalid JSON format in field "${field}": ${err.message}`);
          }
        }
      });
    }
    // Merge file data into req.body (if nee
    // Handle file fields from Multer
    if (req.files) {
      const fileFields = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Map files to their corresponding fields in `req.body`
      if (fileFields.primaryImages) {
        req.body.primaryImages = fileFields.primaryImages.map((file) => ({
          originalname: file.originalname,
          mimetype: file.mimetype,
          path: file.path,
          size: file.size,
          buffer: file.buffer,
        }));
      } else {
        req.body.primaryImages = [];
      }

      if (fileFields.galleryImages) {
        req.body.galleryImages = fileFields.galleryImages.map((file) => ({
          originalname: file.originalname,
          mimetype: file.mimetype,
          path: file.path,
          size: file.size,
          buffer: file.buffer,
        }));
      } else {
        req.body.galleryImages = [];
      }
    }
    const dtoObj = plainToInstance(type, req.body);
    validate(dtoObj, { skipMissingProperties }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const errorsValidation: ErrorValidation[] = [];

        const parseErrors = (validationErrors: ValidationError[], parent = '') => {
          validationErrors.forEach((err) => {
            const propertyPath = parent ? `${parent}.${err.property}` : err.property;

            if (err.constraints) {
              // Add current property errors
              errorsValidation.push({
                [propertyPath]: Object.values(err.constraints).join(', '),
              });
            }

            if (err.children && err.children.length > 0) {
              // Recursively parse child errors
              parseErrors(err.children, propertyPath);
            }
          });
        };

        parseErrors(errors);

        const badRequestError = new BadRequestException('BAD REQUEST', errorsValidation);
        return next(badRequestError);
      } else {
        req.body = dtoObj;
        next();
      }
    });
  };
};
