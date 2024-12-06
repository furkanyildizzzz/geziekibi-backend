import { TourCategory } from 'orm/entities/tour/TourCategory';

export interface ITourCategoryRepository {
  getAll(): Promise<TourCategory[] | void>;
  getById(id: number): Promise<TourCategory | void>;
  getByName(name: string): Promise<TourCategory | void>;
  getBySeoLink(seoLink: string): Promise<TourCategory | void>;
  create(newTourCategory: TourCategory): Promise<TourCategory>;
  update(id: number, tag: TourCategory): Promise<TourCategory>;
  delete(id: number): Promise<void>;
}
