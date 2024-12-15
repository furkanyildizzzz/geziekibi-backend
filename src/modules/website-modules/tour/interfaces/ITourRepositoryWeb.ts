import { Tour } from 'orm/entities/tour/Tour';

export interface ITourRepositoryWeb {
  getAll(): Promise<Tour[] | void>;
  getById(id: number): Promise<Tour | void>;
  getBySeoLink(seoLink: string): Promise<Tour | void>;
  save(newTour: Tour): Promise<Tour>;
  update(id: number, tour: Tour): Promise<Tour>;
  delete(id: number): Promise<void>;
}
