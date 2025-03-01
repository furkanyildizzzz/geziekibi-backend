import { NextFunction, Request, Response } from 'express';
import { ITagService } from 'modules/tag/interfaces/ITagService';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost } from 'inversify-express-utils';
import { INTERFACE_TYPE } from 'core/types';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { DtoValidationMiddleware } from 'middleware/dtoValidation';
import { CreateTagDto } from '../dto/CreateTagDto';
import { DeleteMultipleTagDto } from '../dto/DeleteMultipleTagDto';

@controller('/panel/tag')
export class TagController {
  private readonly service: ITagService;
  constructor(@inject(INTERFACE_TYPE.ITagService) service: ITagService) {
    this.service = service;
  }

  @httpGet('/')
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const tags = await this.service.getAll();
    return res.customSuccess(200, 'Tags found', tags);
  }

  @httpGet('/:id([0-9]+)')
  public async getById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const tag = await this.service.getById(id);
    return res.customSuccess(200, 'Tag found', tag);
  }

  @httpPost('/', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(CreateTagDto))
  public async create(req: Request, res: Response, nex: NextFunction) {
    const tag = await this.service.createTag(req.body);
    return res.customSuccess(200, 'Tag created successfully', tag);
  }

  @httpPost('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(CreateTagDto))
  public async update(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    const tag = await this.service.updateTag(id, req.body);
    return res.customSuccess(200, 'Tag updated successfully', tag);
  }

  @httpDelete('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']))
  public async delete(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    await this.service.deleteTag(id);
    return res.customSuccess(200, 'Tag deleted successfully');
  }

  @httpDelete('/', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(DeleteMultipleTagDto))
  public async deleteMultiple(req: Request, res: Response, nex: NextFunction) {
    await this.service.deleteMultipleTag(req.body);
    return res.customSuccess(200, 'Tags deleted successfully');
  }
}
