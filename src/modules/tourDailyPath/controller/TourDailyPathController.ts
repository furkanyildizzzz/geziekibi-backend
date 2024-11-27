import { INTERFACE_TYPE } from 'core/types';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost } from 'inversify-express-utils';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { DtoValidationMiddleware } from 'middleware/dtoValidation';
import { NextFunction, Request, Response } from 'express';
import { ITourDailyPathService } from '../interfaces/ITourDailyPathService';
import { CreateTourDailyPathDto } from '../dto/CreateTourDailyPathDto';
import { DeleteMultipleTourDailyPathDto } from '../dto/DeleteMultipleTourDailyPathDto';

@controller('/tour/path')
export class TourDailyPathController {
  constructor(@inject(INTERFACE_TYPE.ITourDailyPathService) private readonly service: ITourDailyPathService) {}

  @httpGet('/')
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const tourPaths = await this.service.getAll();
    return res.customSuccess(200, 'Tour paths found', tourPaths);
  }

  @httpGet('/:id([0-9]+)')
  public async getById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const tag = await this.service.getById(id);
    return res.customSuccess(200, 'Tour path found', tag);
  }

  @httpPost('/', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(CreateTourDailyPathDto))
  public async create(req: Request, res: Response, nex: NextFunction) {
    const tag = await this.service.createTourDailyPath(req.body);
    return res.customSuccess(200, 'Tour path created successfully', tag);
  }

  @httpPost('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(CreateTourDailyPathDto))
  public async update(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    const tag = await this.service.updateTourDailyPath(id, req.body);
    return res.customSuccess(200, 'Tour path updated successfully', tag);
  }

  @httpDelete('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']))
  public async delete(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    await this.service.deleteTourDailyPath(id);
    return res.customSuccess(200, 'Tour path deleted successfully');
  }

  @httpDelete('/', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(DeleteMultipleTourDailyPathDto))
  public async deleteMultiple(req: Request, res: Response, nex: NextFunction) {
    await this.service.deleteMultipleTourDailyPath(req.body);
    return res.customSuccess(200, 'Tour paths deleted successfully');
  }
}
