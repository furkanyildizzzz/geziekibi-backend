import { NextFunction, Request, Response } from 'express';
import { IContactFormService } from 'modules/contactForm/interfaces/IContactFormService';
import { inject, injectable } from 'inversify';
import { controller, httpDelete, httpGet, httpPost } from 'inversify-express-utils';
import { INTERFACE_TYPE } from 'core/types';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { DtoValidationMiddleware } from 'middleware/dtoValidation';
import { DeleteMultipleContactFormDto } from '../dto/DeleteMultipleContactFormDto';
import { UpdateContactFormDTO } from '../dto/UpdateContactFormDTO';
import { ResponseContactFormDTO } from '../dto/ResponseContactFormDTO';

@controller('/panel/contactForm')
export class ContactFormController {
  private readonly service: IContactFormService;
  constructor(@inject(INTERFACE_TYPE.IContactFormService) service: IContactFormService) {
    this.service = service;
  }

  @httpGet('/')
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const contactForms = await this.service.getAll();
    return res.customSuccess(200, 'ContactForms found', contactForms);
  }

  @httpGet('/:id([0-9]+)')
  public async getById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const contactForm = await this.service.getById(id);
    return res.customSuccess(200, 'ContactForm found', contactForm);
  }

  @httpPost('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(UpdateContactFormDTO))
  public async update(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    const contactForm = await this.service.updateContactForm(id, req.body);
    return res.customSuccess(200, 'ContactForm updated successfully', contactForm);
  }

  @httpDelete('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']))
  public async delete(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    await this.service.deleteContactForm(id);
    return res.customSuccess(200, 'ContactForm deleted successfully');
  }

  @httpDelete('/', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(DeleteMultipleContactFormDto))
  public async deleteMultiple(req: Request, res: Response, nex: NextFunction) {
    await this.service.deleteMultipleContactForm(req.body);
    return res.customSuccess(200, 'ContactForms deleted successfully');
  }

  @httpPost(
    '/response/:id([0-9]+)',
    checkJwt,
    checkRole(['ADMINISTRATOR']),
    DtoValidationMiddleware(ResponseContactFormDTO),
  )
  public async response(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    const contactForm = await this.service.responseContactForm(id, req.body);
    return res.customSuccess(200, 'ContactForm responded successfully', contactForm);
  }
}
