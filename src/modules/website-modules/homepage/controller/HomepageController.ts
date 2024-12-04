import { INTERFACE_TYPE } from 'core/types';
import { inject } from 'inversify';
import { IHomepageService } from '../interfaces/IHomepageService';
import { controller, httpGet } from 'inversify-express-utils';
import { NextFunction, Request, Response } from 'express';

@controller('/website/homepage')
export class HomepageController {
  constructor(@inject(INTERFACE_TYPE.IHomepageService) private readonly service: IHomepageService) {}

  @httpGet('/featuredTours')
  public async getFeaturedTours(req: Request, res: Response, next: NextFunction) {
    const featuredTours = await this.service.getFeaturedTours();
    return res.customSuccess(200, 'Featured Tours', featuredTours);
  }
  @httpGet('/categories')
  public async getCategories(req: Request, res: Response, next: NextFunction) {
    const categories = await this.service.getCategories();
    return res.customSuccess(200, 'Categories', categories);
  }
  @httpGet('/topTours')
  public async getTopTours(req: Request, res: Response, next: NextFunction) {
    const topTours = await this.service.getTopTours();
    return res.customSuccess(200, 'Top Tours', topTours);
  }
}
