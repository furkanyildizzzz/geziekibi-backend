import { INTERFACE_TYPE } from 'core/types';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost } from 'inversify-express-utils';
import { ITourServiceService } from '../interfaces/ITourServiceService';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { DtoValidationMiddleware } from 'middleware/dtoValidation';
import { NextFunction, Request, Response } from 'express';
import { CreateTourServiceDto } from '../dto/CreateTourServiceDto';
import { DeleteMultipleServiceDto } from '../dto/DeleteMultipleServiceDto';

@controller('/tour/service')
export class TourServiceController {
  constructor(@inject(INTERFACE_TYPE.ITourServiceService) private readonly service: ITourServiceService) {}

  @httpGet('/')
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const tags = await this.service.getAll();
    return res.customSuccess(200, 'Tour Services found', tags);
  }

  @httpGet('/:id([0-9]+)')
  public async getById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const tag = await this.service.getById(id);
    return res.customSuccess(200, 'Tour Service found', tag);
  }

  @httpPost('/', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(CreateTourServiceDto))
  public async create(req: Request, res: Response, nex: NextFunction) {
    const tag = await this.service.createTourService(req.body);
    return res.customSuccess(200, 'Tour Service created successfully', tag);
  }

  @httpPost('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(CreateTourServiceDto))
  public async update(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    const tag = await this.service.updateTourService(id, req.body);
    return res.customSuccess(200, 'Tour Service updated successfully', tag);
  }

  @httpDelete('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']))
  public async delete(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    await this.service.deleteTourService(id);
    return res.customSuccess(200, 'Tour Service deleted successfully');
  }

  @httpDelete('/', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(DeleteMultipleServiceDto))
  public async deleteMultiple(req: Request, res: Response, nex: NextFunction) {
    await this.service.deleteMultipleService(req.body);
    return res.customSuccess(200, 'Tour Services deleted successfully');
  }
}
