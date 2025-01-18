import { ContactForm } from 'orm/entities/contactForm/ContactForm';

export interface IContactFormRepository {
  getAll(): Promise<ContactForm[] | void>;
  getById(id: number): Promise<ContactForm | void>;
  update(id: number, tag: ContactForm): Promise<ContactForm>;
  delete(id: number): Promise<void>;
  deleteMultiple(ids: number[]): Promise<void>;
}
