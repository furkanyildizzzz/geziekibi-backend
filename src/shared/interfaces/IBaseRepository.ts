import { BaseEntity } from 'orm/entities/BaseEntity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IBaseRepository<T extends BaseEntity> {
  getAll(disableFilter?: boolean): Promise<T[] | void>;
  getById(id: number, disableFilter?: boolean): Promise<T | void>;
  create(entity: T): Promise<T>;
  update(id: number, entity: QueryDeepPartialEntity<T>): Promise<T | null>;
  delete(id: number): Promise<void>;
  deleteMultiple(ids: number[]): Promise<void>;
  findOneByField<K extends keyof T>(field: K, value: T[K]): Promise<T | null>
}
