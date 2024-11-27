import { TourDailyPath } from 'orm/entities/tour/TourDailyPath';

export interface ITourDailyPathRepository {
  getAll(): Promise<TourDailyPath[] | void>;
  getById(id: number): Promise<TourDailyPath | void>;
  getByName(name: string): Promise<TourDailyPath | void>;
  create(newTourDailyPath: TourDailyPath): Promise<TourDailyPath>;
  update(id: number, tourPath: TourDailyPath): Promise<TourDailyPath>;
  delete(id: number): Promise<void>;
  deleteMultiple(ids: number[]): Promise<void>;
}
