import { INTERFACE_TYPE } from 'core/types';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost } from 'inversify-express-utils';
import { ITourService } from '../interfaces/ITourService';
import { NextFunction, Request, Response } from 'express';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { DtoValidationMiddleware } from 'middleware/dtoValidation';
import { EditTourDto } from '../dto/EditTourDto';
import { uploadMiddleware } from 'middleware/multer';
import { CreateTourDto } from '../dto/CreateTourDto';

@controller('/tour')
export class TourController {
  constructor(@inject(INTERFACE_TYPE.ITourService) private readonly service: ITourService) {}

  @httpGet('/')
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const tours = await this.service.getAll();
    return res.customSuccess(200, 'Tours', tours);
  }

  @httpGet('/:id([0-9]+)')
  public async getById(req: Request, res: Response, next: NextFunction) {
    const tag = await this.service.getById(req.params.id);
    return res.customSuccess(200, 'Tag found', tag);
  }

  @httpPost('/', checkJwt, checkRole(['ADMINISTRATOR']), uploadMiddleware, DtoValidationMiddleware(CreateTourDto, true))
  public async create(req: Request, res: Response, next: NextFunction) {
    const tour = await this.service.createTour(req.body);
    return res.customSuccess(200, 'Tour saved successfully', tour);
  }

  @httpPost(
    '/:id([0-9]+)',
    checkJwt,
    checkRole(['ADMINISTRATOR']),
    uploadMiddleware,
    DtoValidationMiddleware(EditTourDto, true),
  )
  public async update(req: Request, res: Response, next: NextFunction) {
    const tour = await this.service.updateTour(req.params.id, req.body);
    return res.customSuccess(200, 'Tour updated successfully', tour);
  }

  @httpDelete('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']))
  public async delete(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    await this.service.deleteTour(id);
    return res.customSuccess(200, 'Tour deleted successfully');
  }
}
