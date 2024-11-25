import { TourPath } from 'orm/entities/tour/TourPath';

export interface ITourPathRepository {
  getAll(): Promise<TourPath[] | void>;
  getById(id: number): Promise<TourPath | void>;
  getByName(name: string): Promise<TourPath | void>;
  create(newTourPath: TourPath): Promise<TourPath>;
  update(id: number, tourPath: TourPath): Promise<TourPath>;
  delete(id: number): Promise<void>;
  deleteMultiple(ids: number[]): Promise<void>;
}
