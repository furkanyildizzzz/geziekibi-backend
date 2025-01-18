import { INTERFACE_TYPE } from 'core/types';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost } from 'inversify-express-utils';
import { ITourServiceWeb } from '../interfaces/ITourServiceWeb';
import { NextFunction, Request, Response } from 'express';

@controller('/website/tour')
export class TourControllerWeb {
  constructor(@inject(INTERFACE_TYPE.ITourServiceWeb) private readonly service: ITourServiceWeb) {}

  @httpGet('/')
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const { categoryId } = req.query;
    const tours = await this.service.getAll(categoryId as string);
    return res.customSuccess(200, 'Tours', tours);
  }

  @httpGet('/:seoLink')
  public async getBySeoLink(req: Request, res: Response, next: NextFunction) {
    const tour = await this.service.getBySeoLink(req.params.seoLink);
    return res.customSuccess(200, 'Tour found', tour);
  }

  @httpGet('/category/:seoLink')
  public async getCategoryBySeoLink(req: Request, res: Response, next: NextFunction) {
    const tour = await this.service.getCategoryBySeoLink(req.params.seoLink);
    return res.customSuccess(200, 'Tour Category found', tour);
  }

  @httpPost('/search')
  public async searchTour(req: Request, res: Response, next: NextFunction) {
    const tours = await this.service.searchTours(req.body);
    return res.customSuccess(200, 'Tours', tours);
  }
}
