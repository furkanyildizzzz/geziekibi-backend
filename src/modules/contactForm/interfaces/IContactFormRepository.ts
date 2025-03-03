import { ContactForm } from 'orm/entities/contactForm/ContactForm';
import { IBaseRepository } from 'shared/interfaces/IBaseRepository';

export interface IContactFormRepository extends IBaseRepository<ContactForm> {
  // getAll(): Promise<ContactForm[] | void>;
  // getById(id: number): Promise<ContactForm | void>;
  // update(id: number, tag: ContactForm): Promise<ContactForm>;
  // delete(id: number): Promise<void>;
  // deleteMultiple(ids: number[]): Promise<void>;
}
