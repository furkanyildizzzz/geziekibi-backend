import { INTERFACE_TYPE } from 'core/types';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost } from 'inversify-express-utils';
import { IServiceInteractor } from '../interfaces/IServiceInteractor';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { DtoValidationMiddleware } from 'middleware/dtoValidation';
import { NextFunction, Request, Response } from 'express';
import { CreateServiceDto } from '../dto/CreateServiceDto';
import { DeleteMultipleServiceDto } from '../dto/DeleteMultipleServiceDto';

@controller('/panel/tour/service')
export class ServiceController {
  constructor(@inject(INTERFACE_TYPE.IServiceInteractor) private readonly service: IServiceInteractor) {}

  @httpGet('/')
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const tags = await this.service.getAll();
    return res.customSuccess(200, 'Services found', tags);
  }

  @httpGet('/:id([0-9]+)')
  public async getById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const tag = await this.service.getById(id);
    return res.customSuccess(200, 'Service found', tag);
  }

  @httpPost('/', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(CreateServiceDto))
  public async create(req: Request, res: Response, nex: NextFunction) {
    const tag = await this.service.createService(req.body);
    return res.customSuccess(200, 'Service created successfully', tag);
  }

  @httpPost('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(CreateServiceDto))
  public async update(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    const tag = await this.service.updateService(id, req.body);
    return res.customSuccess(200, 'Service updated successfully', tag);
  }

  @httpDelete('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']))
  public async delete(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    await this.service.deleteService(id);
    return res.customSuccess(200, 'Service deleted successfully');
  }

  @httpDelete('/', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(DeleteMultipleServiceDto))
  public async deleteMultiple(req: Request, res: Response, nex: NextFunction) {
    await this.service.deleteMultipleService(req.body);
    return res.customSuccess(200, 'Services deleted successfully');
  }
}
