import { INTERFACE_TYPE } from 'core/types';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost } from 'inversify-express-utils';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { DtoValidationMiddleware } from 'middleware/dtoValidation';
import { NextFunction, Request, Response } from 'express';
import { ITourPathService } from '../interfaces/ITourPathService';
import { CreateTourPathDto } from '../dto/CreateTourPathDto';
import { DeleteMultipleTourPathDto } from '../dto/DeleteMultipleTourPathDto';

@controller('/tour/path')
export class TourPathController {
  constructor(@inject(INTERFACE_TYPE.ITourPathService) private readonly service: ITourPathService) {}

  @httpGet('/')
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const tags = await this.service.getAll();
    return res.customSuccess(200, 'Tour paths found', tags);
  }

  @httpGet('/:id([0-9]+)')
  public async getById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const tag = await this.service.getById(id);
    return res.customSuccess(200, 'Tour path found', tag);
  }

  @httpPost('/', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(CreateTourPathDto))
  public async create(req: Request, res: Response, nex: NextFunction) {
    const tag = await this.service.createTourPath(req.body);
    return res.customSuccess(200, 'Tour path created successfully', tag);
  }

  @httpPost('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(CreateTourPathDto))
  public async update(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    const tag = await this.service.updateTourPath(id, req.body);
    return res.customSuccess(200, 'Tour path updated successfully', tag);
  }

  @httpDelete('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']))
  public async delete(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    await this.service.deleteTourPath(id);
    return res.customSuccess(200, 'Tour path deleted successfully');
  }

  @httpDelete('/', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(DeleteMultipleTourPathDto))
  public async deleteMultiple(req: Request, res: Response, nex: NextFunction) {
    await this.service.deleteMultipleTourPath(req.body);
    return res.customSuccess(200, 'Tour paths deleted successfully');
  }
}
