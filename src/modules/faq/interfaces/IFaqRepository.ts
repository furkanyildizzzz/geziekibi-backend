import { FAQ } from 'orm/entities/faq/FAQ';
import { IBaseRepository } from 'shared/interfaces/IBaseRepository';

export interface IFaqRepository extends IBaseRepository<FAQ>{
  // getAll(): Promise<FAQ[] | void>;
  // getById(id: number): Promise<FAQ | void>;
  // create(newFAQ: FAQ): Promise<FAQ>;
  // update(id: number, faq: FAQ): Promise<FAQ>;
  // delete(id: number): Promise<void>;
  // deleteMultiple(ids: number[]): Promise<void>;
}
