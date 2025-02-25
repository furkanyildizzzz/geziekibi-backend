import { IsEnum, IsEmail, IsObject } from 'class-validator';
import { EmailTemplateEnum } from 'shared/utils/enum';

export class SendEmailDto {
  @IsEnum(EmailTemplateEnum)
  key: EmailTemplateEnum;

  @IsEmail()
  to: string;

  @IsObject()
  params: Record<string, string>;
}
