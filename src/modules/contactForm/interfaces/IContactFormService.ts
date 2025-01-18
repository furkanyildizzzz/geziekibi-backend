import { ContactFormSuccessDTO } from 'modules/contactForm/dto/ContactFormSuccessDTO';
import { DeleteMultipleContactFormDto } from '../dto/DeleteMultipleContactFormDto';
import { UpdateContactFormDTO } from '../dto/UpdateContactFormDTO';

export interface IContactFormService {
  getAll(): Promise<ContactFormSuccessDTO[]>;
  getById(id: string): Promise<ContactFormSuccessDTO>;
  updateContactForm(id: string, contactFormData: UpdateContactFormDTO): Promise<ContactFormSuccessDTO>;
  deleteContactForm(id: string): Promise<void>;
  deleteMultipleContactForm(contactForms: DeleteMultipleContactFormDto): Promise<void>;
}
