import { Tour } from 'orm/entities/tour/Tour';
import { IBaseRepository } from 'shared/interfaces/IBaseRepository';

export interface ITourRepository extends IBaseRepository<Tour> {
  // getAll(): Promise<Tour[] | void>;
  // getById(id: number): Promise<Tour | void>;
  getBySeoLink(seoLink: string): Promise<Tour | void>;
  // save(newTour: Tour): Promise<Tour>;
  // update(id: number, tour: Tour): Promise<Tour>;
  // delete(id: number): Promise<void>;
}
