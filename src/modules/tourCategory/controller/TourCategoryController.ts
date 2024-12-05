import { INTERFACE_TYPE } from 'core/types';
import { controller, httpDelete, httpGet, httpPost } from 'inversify-express-utils';
import { ITourCategoryService } from '../interfaces/ITourCategoryService';
import { inject } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { DtoValidationMiddleware } from 'middleware/dtoValidation';
import { CreateTourCategoryDto } from '../dto/CreateTourCategoryDto';
import { uploadMiddleware } from 'middleware/multer';

@controller('/panel/tour/category')
export class TourCategoryController {
  constructor(@inject(INTERFACE_TYPE.ITourCategoryService) private readonly service: ITourCategoryService) {}

  @httpGet('/')
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const tourCategories = await this.service.getAll();
    return res.customSuccess(200, 'Tour Categories', tourCategories);
  }

  @httpGet('/:id([0-9]+)')
  public async getById(req: Request, res: Response, next: NextFunction) {
    const tourCategory = await this.service.getById(req.params.id);
    return res.customSuccess(200, 'Tour Category', tourCategory);
  }

  @httpPost('/', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(CreateTourCategoryDto))
  public async create(req: Request, res: Response, nex: NextFunction) {
    const tourCategory = await this.service.createTourCategory(req.body);
    return res.customSuccess(200, `Tour Category '${tourCategory.name}' created successfully`, tourCategory);
  }

  @httpPost(
    '/:id([0-9]+)',
    checkJwt,
    checkRole(['ADMINISTRATOR']),
    uploadMiddleware,
    DtoValidationMiddleware(CreateTourCategoryDto),
  )
  public async update(req: Request, res: Response, nex: NextFunction) {
    const tourCategory = await this.service.updateTourCategory(req.params.id, req.body);
    return res.customSuccess(200, 'Tour Category updated successfully', tourCategory);
  }

  @httpDelete('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']))
  public async delete(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    await this.service.deleteTourCategory(id);
    return res.customSuccess(200, 'Tour Category deleted successfully');
  }
}
