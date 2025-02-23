import { EmailTemplateEnum } from 'shared/utils/enum';

export interface IEmailService {
  sendEmail(to: string, template: EmailTemplateEnum, variables: Record<string, string>): Promise<void>;
}
