import { Expose } from 'class-transformer';

export class ContactFormSuccessDTO {
  @Expose() id: number;
  @Expose() firstName: string;
  @Expose() lastName: string;
  @Expose() email: string;
  @Expose() phone?: string;
  @Expose() message: string;
  @Expose() response?: string;
  @Expose() isResponded: boolean;
  @Expose() fullName: string;
  @Expose() agreeToTerms: boolean;
}
