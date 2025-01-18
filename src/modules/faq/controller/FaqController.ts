import { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost } from 'inversify-express-utils';
import { INTERFACE_TYPE } from 'core/types';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { DtoValidationMiddleware } from 'middleware/dtoValidation';
import { IFaqService } from '../interfaces/IFaqService';
import { CreateFaqDto } from '../dto/CreateFaqDto';
import { DeleteMultipleFaqDto } from '../dto/DeleteMultipleFaqDto';

@controller('/panel/faq')
export class FaqController {
  private readonly service: IFaqService;
  constructor(@inject(INTERFACE_TYPE.IFaqService) service: IFaqService) {
    this.service = service;
  }

  @httpGet('/')
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const faqs = await this.service.getAll();
    return res.customSuccess(200, 'Faqs found', faqs);
  }

  @httpGet('/:id([0-9]+)')
  public async getById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const faq = await this.service.getById(id);
    return res.customSuccess(200, 'Faq found', faq);
  }

  @httpPost('/', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(CreateFaqDto))
  public async create(req: Request, res: Response, nex: NextFunction) {
    const faq = await this.service.createFaq(req.body);
    return res.customSuccess(200, 'Faq created successfully', faq);
  }

  @httpPost('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(CreateFaqDto))
  public async update(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    const faq = await this.service.updateFaq(id, req.body);
    return res.customSuccess(200, 'Faq updated successfully', faq);
  }

  @httpDelete('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']))
  public async delete(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    await this.service.deleteFaq(id);
    return res.customSuccess(200, 'Faq deleted successfully');
  }

  @httpDelete('/', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(DeleteMultipleFaqDto))
  public async deleteMultiple(req: Request, res: Response, nex: NextFunction) {
    await this.service.deleteMultipleFaq(req.body);
    return res.customSuccess(200, 'Faqs deleted successfully');
  }
}
