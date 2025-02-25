import { v2 } from 'cloudinary';
import { INTERFACE_TYPE } from 'core/types';
import { injectable, inject } from 'inversify';
import nodemailer from 'nodemailer';
import { EmailTemplate } from 'orm/entities/emailTemplate/EmailTemplate';
import { BadRequestException, InternalServerErrorException, NotFoundException } from 'shared/errors/allException';
import { IEmailService } from 'shared/interfaces/IEmailService';
import { EmailTemplateEnum } from 'shared/utils/enum';
import { UnitOfWork } from 'unitOfWork/unitOfWork';

@injectable()
export class EmailService implements IEmailService {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork) {}

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  /** 📩 Tüm email şablonlarını getir */
  public async getAllTemplates(): Promise<EmailTemplate[]> {
    const emailTemplateRepo = await this.unitOfWork.getRepository(EmailTemplate);
    return emailTemplateRepo.find();
  }

  /** 📩 Belirli bir email şablonunu getir */
  public async getTemplateByKey(key: EmailTemplateEnum): Promise<EmailTemplate | null> {
    const emailTemplateRepo = await this.unitOfWork.getRepository(EmailTemplate);
    return emailTemplateRepo.findOne({ where: { key } });
  }

  /** 📩 Email gönder */
  public async sendEmail(to: string, template: EmailTemplateEnum, variables: Record<string, string>): Promise<void> {
    const emailTemplateRepo = await this.unitOfWork.getRepository(EmailTemplate);

    // Şablonu enum key ile veritabanından al
    const templateData = await emailTemplateRepo.findOne({ where: { key: template } });
    if (!templateData) throw new NotFoundException(`Email template '${template}' not found`);

    // Şablon içeriğini değişkenlerle değiştir
    const emailBody = this.replaceTemplateVariables(templateData.body, variables);
    const emailSubject = this.replaceTemplateVariables(templateData.subject, variables);
    console.log({
      from: process.env.SMTP_EMAIL,
      to,
      subject: emailSubject,
      html: emailBody,
    });
    // Maili gönder
    await this.transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to,
      subject: emailSubject,
      html: emailBody,
    });
  }

  /** 📩 Email şablonunu güncelle */
  public async updateTemplate(key: EmailTemplateEnum, subject: string, body: string): Promise<void> {
    const emailTemplateRepo = await this.unitOfWork.getRepository(EmailTemplate);

    const template = await emailTemplateRepo.findOne({ where: { key } });
    if (!template) throw new NotFoundException(`Email template '${key}' not found`);

    template.subject = subject;
    template.body = body;

    await emailTemplateRepo.save(template);
  }

  public async uploadBodyImage(file: Express.Multer.File): Promise<string> {
    if (file) {
      const imageStr = 'data:image/jpeg;base64,' + file.buffer.toString('base64');
      return await v2.uploader
        .upload(imageStr, { folder: `${process.env.NODE_ENV}/emailTemplateBodyImage/` })
        .then((result) => {
          const imageUrl = result.url;
          console.log({ imageUrl });
          return imageUrl;
        })
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err.message);
        });
    } else {
      throw new BadRequestException('No file provided');
    }
  }

  private replaceTemplateVariables(template: string, variables: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
  }
}
