import { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { INTERFACE_TYPE } from 'core/types';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { DtoValidationMiddleware } from 'middleware/dtoValidation';
import { SendEmailDto } from '../dto/SendEmailDto';
import { UpdateEmailTemplateDto } from '../dto/UpdateEmailTemplateDto';
import { IEmailService } from 'shared/interfaces/IEmailService';
import { EmailTemplateEnum } from 'shared/utils/enum';
import { BadRequestException, NotFoundException } from 'shared/errors/allException';
import { uploadMiddleware } from 'middleware/multer';

@controller('/panel/email')
export class EmailController {
  private readonly service: IEmailService;

  constructor(@inject(INTERFACE_TYPE.IEmailService) service: IEmailService) {
    this.service = service;
  }

  /** 📩 Tüm email şablonlarını getir */
  @httpGet('/templates')
  public async getAllTemplates(req: Request, res: Response, next: NextFunction) {
    const templates = await this.service.getAllTemplates();
    return res.customSuccess(200, 'Email templates found', templates);
  }

  /** 📩 Belirli bir email şablonunu getir */
  @httpGet('/templates/:key')
  public async getTemplateByKey(req: Request, res: Response, next: NextFunction) {
    const enumKey = req.params.key as EmailTemplateEnum; // 🔹 Enum'a cast ettik
    if (!Object.values(EmailTemplateEnum).includes(enumKey)) {
      throw new NotFoundException('Invalid email template key');
    }
    const template = await this.service.getTemplateByKey(enumKey);
    return res.customSuccess(200, 'Email template found', template);
  }

  /** 📩 Email gönder */
  @httpPost('/send', checkJwt, DtoValidationMiddleware(SendEmailDto))
  public async sendEmail(req: Request, res: Response, next: NextFunction) {
    const { key, to, params } = req.body;
    const enumKey = key as EmailTemplateEnum; // 🔹 Enum'a cast ettik
    if (!Object.values(EmailTemplateEnum).includes(enumKey)) {
      throw new NotFoundException('Invalid email template key');
    }
    const result = await this.service.sendEmail(to, enumKey, params);
    return res.customSuccess(200, 'Email sent successfully', result);
  }

  /** 📩 Email şablonunu güncelle (Sadece Admin) */
  @httpPost('/templates/:key', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(UpdateEmailTemplateDto))
  public async updateTemplate(req: Request, res: Response, next: NextFunction) {
    const key = req.params.key as EmailTemplateEnum;

    // 🔹 Enum doğrulaması yap
    if (!Object.values(EmailTemplateEnum).includes(key)) {
      throw new NotFoundException('Invalid email template key');
    }

    const { subject, body } = req.body;

    // 🔹 `subject` ve `body` boş olamaz, kontrol et
    if (!subject || !body) {
      throw new BadRequestException('Subject and body are required.');
    }

    // 🔹 Email şablonunu güncelle
    await this.service.updateTemplate(key, subject, body);

    return res.customSuccess(200, 'Email template updated successfully');
  }

  @httpPost('/uploadBodyImage', checkJwt, checkRole(['ADMINISTRATOR']), uploadMiddleware)
  public async uploadBodyImage(req: Request, res: Response, next: NextFunction) {
    const imageUrl = await this.service.uploadBodyImage(req.files['uploadBodyImage'][0]);
    return res.customSuccess(200, 'Email template body image uploaded successfully', imageUrl);
  }
}
