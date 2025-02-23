import { INTERFACE_TYPE } from 'core/types';
import { injectable, inject } from 'inversify';
import nodemailer from 'nodemailer';
import { EmailTemplate } from 'orm/entities/emailTemplate/EmailTemplate';
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

  public async sendEmail(to: string, template: EmailTemplateEnum, variables: Record<string, string>): Promise<void> {
    const emailTemplateRepo = await this.unitOfWork.getRepository(EmailTemplate);

    // Şablonu enum key ile veritabanından al
    const templateData = await emailTemplateRepo.findOne({ where: { key: template } });
    if (!templateData) throw new Error(`Email template '${template}' not found`);

    // Şablon içeriğini değişkenlerle değiştir
    let emailBody = templateData.body;
    let emailSubject = templateData.subject;

    for (const [key, value] of Object.entries(variables)) {
      emailBody = emailBody.replace(new RegExp(`{{${key}}}`, 'g'), value);
      emailSubject = emailSubject.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    // Maili gönder
    await this.transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to,
      subject: emailSubject,
      html: emailBody,
    });
  }
}
