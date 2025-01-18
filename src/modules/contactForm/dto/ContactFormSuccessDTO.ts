export class ContactFormSuccessDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  response?: string;
  isResponded: boolean;

  agreeToTerms: boolean;
}
