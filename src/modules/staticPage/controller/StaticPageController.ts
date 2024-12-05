import { INTERFACE_TYPE } from 'core/types';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost } from 'inversify-express-utils';
import { IStaticPageService } from '../interfaces/IStaticPageService';
import { NextFunction, Request, Response } from 'express';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { DtoValidationMiddleware } from 'middleware/dtoValidation';
import { uploadMiddleware } from 'middleware/multer';
import { CreateStaticPageDto } from '../dto/CreateStaticPageDto';
import { StaticPageType } from 'shared/utils/enum';
import { BadRequestException } from 'shared/errors/allException';

@controller('/panel/staticPage')
export class StaticPageController {
  constructor(@inject(INTERFACE_TYPE.IStaticPageService) private readonly service: IStaticPageService) {}

  @httpGet('/')
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const staticPages = await this.service.getAll();
    return res.customSuccess(200, 'StaticPages', staticPages);
  }

  @httpGet('/:id([0-9]+)')
  public async getById(req: Request, res: Response, next: NextFunction) {
    const staticPage = await this.service.getById(req.params.id);
    console.log({ staticPage });
    return res.customSuccess(200, 'Static Page found', staticPage);
  }

  @httpPost(
    '/',
    checkJwt,
    checkRole(['ADMINISTRATOR']),
    uploadMiddleware,
    DtoValidationMiddleware(CreateStaticPageDto, true),
  )
  public async create(req: Request, res: Response, next: NextFunction) {
    const staticPage = await this.service.createStaticPage(req.body);
    return res.customSuccess(200, 'Static Page saved successfully', staticPage);
  }

  @httpPost(
    '/:id([0-9]+)',
    checkJwt,
    checkRole(['ADMINISTRATOR']),
    uploadMiddleware,
    DtoValidationMiddleware(CreateStaticPageDto, true),
  )
  public async update(req: Request, res: Response, next: NextFunction) {
    const staticPage = await this.service.updateStaticPage(req.params.id, req.body);
    console.log({ staticPage });
    return res.customSuccess(200, 'Static Page updated successfully', staticPage);
  }

  @httpGet('/pageType')
  public async getByPageType(req: Request, res: Response, next: NextFunction) {
    const { type } = req.query;

    // Check if `type` is a valid enum value
    if (!type || !Object.values(StaticPageType).includes(type as StaticPageType)) {
      throw new BadRequestException(`'Page Type' must be one of ${Object.values(StaticPageType).join(', ')}`);
    }

    const staticPage = await this.service.getByPageType(type as StaticPageType);
    console.log({ staticPage });
    return res.customSuccess(200, 'Static Page found', staticPage);
  }

  @httpDelete('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']))
  public async delete(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    await this.service.deleteStaticPage(id);
    return res.customSuccess(200, 'Static Page deleted successfully');
  }

  @httpPost('/uploadBodyImage', checkJwt, checkRole(['ADMINISTRATOR']), uploadMiddleware)
  public async uploadBodyImage(req: Request, res: Response, next: NextFunction) {
    const imageUrl = await this.service.uploadBodyImage(req.files['uploadBodyImage'][0]);
    return res.customSuccess(200, 'Static Page body image uploaded successfully', imageUrl);
  }
}
