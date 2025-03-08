import { BaseEntity } from 'orm/entities/BaseEntity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IBaseRepository<T extends BaseEntity> {
  getAll(relations?: string[], disableFilter?: boolean): Promise<T[] | void>;
  getById(id: number, relations?: string[],disableFilter?: boolean): Promise<T | void>;
  getByIds(ids: number[], relations?: string[],disableFilter?: boolean): Promise<T[] | void>;
  create(entity: T): Promise<T>;
  update(id: number, entity: QueryDeepPartialEntity<T>): Promise<T | null>;
  save(id: number, entity: T): Promise<T | null>;
  delete(id: number): Promise<void>;
  deleteMultiple(ids: number[]): Promise<void>;
  findOneByField<K extends keyof T>(field: K, value: T[K]): Promise<T | null>
  findAllByField<K extends keyof T>(field: K, value: T[K]): Promise<T[] | null>
  findByIds(ids: number[]): Promise<T[]>;
}
