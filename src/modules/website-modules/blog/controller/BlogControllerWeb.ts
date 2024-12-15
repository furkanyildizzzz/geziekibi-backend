import { INTERFACE_TYPE } from 'core/types';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost } from 'inversify-express-utils';
import { IBlogServiceWeb } from '../interfaces/IBlogServiceWeb';
import { NextFunction, Request, Response } from 'express';

@controller('/website/blog')
export class BlogControllerWeb {
  constructor(@inject(INTERFACE_TYPE.IBlogService) private readonly service: IBlogServiceWeb) {}

  @httpGet('/')
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const blogs = await this.service.getAll();
    return res.customSuccess(200, 'Blogs', blogs);
  }

  @httpGet('/:seoLink')
  public async getById(req: Request, res: Response, next: NextFunction) {
    const blog = await this.service.getBySeoLink(req.params.seoLink);
    return res.customSuccess(200, 'Blog found', blog);
  }
}
