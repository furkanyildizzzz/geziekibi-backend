import { NextFunction, Request, Response } from 'express';
import { ITagService } from 'modules/tag/interfaces/ITagService';
import { inject } from 'inversify';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { INTERFACE_TYPE } from 'core/types';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { DtoValidationMiddleware } from 'middleware/dtoValidation';
import { TagCreateDto } from '../dto/TagCreateDTO';

@controller('/tag')
export class TagController {
  private readonly interactor: ITagService;
  constructor(@inject(INTERFACE_TYPE.ITagService) interactor: ITagService) {
    this.interactor = interactor;
  }

  @httpGet('/')
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const tags = await this.interactor.getAll();
    return res.customSuccess(200, 'Tags found', tags);
  }

  @httpGet('/:id([0-9]+)')
  public async getById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const tag = await this.interactor.getById(id);
    return res.customSuccess(200, 'Tag found', tag);
  }

  @httpPost('/', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(TagCreateDto))
  public async create(req: Request, res: Response, nex: NextFunction) {}
}
