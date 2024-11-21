import { Service } from 'orm/entities/service/Service';

export interface IServiceRepository {
  getAll(): Promise<Service[] | void>;
  getById(id: number): Promise<Service | void>;
  getByName(name: string): Promise<Service | void>;
  create(newService: Service): Promise<Service>;
  update(id: number, service: Service): Promise<Service>;
  delete(id: number): Promise<void>;
  deleteMultiple(ids: number[]): Promise<void>;
}
