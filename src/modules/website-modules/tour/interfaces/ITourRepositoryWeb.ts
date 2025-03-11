import { Tour } from 'orm/entities/tour/Tour';

export interface ITourRepositoryWeb {
  getAll(): Promise<Tour[] | void>;
  getById(id: number): Promise<Tour | void>;
  getBySeoLink(seoLink: string): Promise<Tour | void>;
}
