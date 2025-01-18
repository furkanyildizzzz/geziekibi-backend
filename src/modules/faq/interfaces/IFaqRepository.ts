import { FAQ } from 'orm/entities/faq/FAQ';

export interface IFaqRepository {
  getAll(): Promise<FAQ[] | void>;
  getById(id: number): Promise<FAQ | void>;
  create(newFAQ: FAQ): Promise<FAQ>;
  update(id: number, faq: FAQ): Promise<FAQ>;
  delete(id: number): Promise<void>;
  deleteMultiple(ids: number[]): Promise<void>;
}
