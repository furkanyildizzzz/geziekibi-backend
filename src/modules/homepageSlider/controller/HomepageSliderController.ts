import { INTERFACE_TYPE } from 'core/types';
import { controller, httpDelete, httpGet, httpPost } from 'inversify-express-utils';
import { IHomepageSliderService } from '../interfaces/IHomepageSliderService';
import { inject } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { DtoValidationMiddleware } from 'middleware/dtoValidation';
import { CreateHomepageSliderDto } from '../dto/CreateHomepageSliderDto';
import { uploadMiddleware } from 'middleware/multer';

@controller('/panel/homepageSlider')
export class HomepageSliderController {
  constructor(@inject(INTERFACE_TYPE.IHomepageSliderService) private readonly service: IHomepageSliderService) {}

  @httpGet('/')
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const homepageSliders = await this.service.getAll();
    return res.customSuccess(200, 'Homepage Sliders', homepageSliders);
  }

  @httpGet('/:id([0-9]+)')
  public async getById(req: Request, res: Response, next: NextFunction) {
    const homepageSlider = await this.service.getById(req.params.id);
    return res.customSuccess(200, 'Homepage Slider', homepageSlider);
  }

  @httpPost(
    '/',
    checkJwt,
    checkRole(['ADMINISTRATOR']),
    uploadMiddleware,
    DtoValidationMiddleware(CreateHomepageSliderDto),
  )
  public async create(req: Request, res: Response, nex: NextFunction) {
    const homepageSlider = await this.service.createHomepageSlider(req.body, req.files as Express.Multer.File[]);
    return res.customSuccess(200, `Homepage Slider created successfully`, homepageSlider);
  }

  @httpPost(
    '/:id([0-9]+)',
    checkJwt,
    checkRole(['ADMINISTRATOR']),
    uploadMiddleware,
    DtoValidationMiddleware(CreateHomepageSliderDto),
  )
  public async update(req: Request, res: Response, nex: NextFunction) {
    const homepageSlider = await this.service.updateHomepageSlider(
      req.params.id,
      req.body,
      req.files as Express.Multer.File[],
    );
    return res.customSuccess(200, 'Homepage Slider updated successfully', homepageSlider);
  }

  @httpDelete('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']))
  public async delete(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    await this.service.deleteHomepageSlider(id);
    return res.customSuccess(200, 'Homepage Slider deleted successfully');
  }
}
