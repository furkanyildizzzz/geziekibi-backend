import { TourDailyPath } from 'orm/entities/tour/TourDailyPath';
import { IBaseRepository } from 'shared/interfaces/IBaseRepository';

export interface ITourDailyPathRepository extends IBaseRepository<TourDailyPath> {
  // getAll(): Promise<TourDailyPath[] | void>;
  // getById(id: number): Promise<TourDailyPath | void>;
  getByName(name: string): Promise<TourDailyPath | void>;
  // create(newTourDailyPath: TourDailyPath): Promise<TourDailyPath>;
  // update(id: number, tourPath: TourDailyPath): Promise<TourDailyPath>;
  // delete(id: number): Promise<void>;
  // deleteMultiple(ids: number[]): Promise<void>;
}
