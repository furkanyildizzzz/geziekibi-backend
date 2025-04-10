import { inject, injectable } from 'inversify';
import { IServiceRepository } from '../interfaces/IServiceRepository';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { InternalServerErrorException } from 'shared/errors/allException';
import { Service } from 'orm/entities/service/Service';
import { BaseRepository } from 'shared/repositories/BaseRepository';

@injectable()
export class ServiceRepository extends BaseRepository<Service> implements IServiceRepository {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) unitOfWork: UnitOfWork) {
    super(unitOfWork, Service)
  }

  // async getAll(): Promise<Service[] | void> {
  //   try {
  //     const repo = await this.unitOfWork.getRepository(Service);
  //     const tags = await repo.find();
  //     if (tags) return tags as Service[];
  //   } catch (error) {
  //     throw new InternalServerErrorException(`${error.message}`);
  //   }
  // }

  // async getById(id: number): Promise<Service | void> {
  //   try {
  //     const repo = await this.unitOfWork.getRepository(Service);
  //     const tag = await repo.findOne({ where: { id: id } });
  //     if (tag) return tag as Service;
  //   } catch (error) {
  //     throw new InternalServerErrorException(`${error.message}`);
  //   }
  // }

  async getByName(name: string): Promise<Service | void> {
    return this.findOneByField("name", name);
  }

  // async create(newService: Service): Promise<Service> {
  //   try {
  //     await this.unitOfWork.startTransaction();
  //     await (await this.unitOfWork.getRepository(Service)).save(newService);
  //     await this.unitOfWork.commitTransaction();
  //     return newService;
  //   } catch (error) {
  //     await this.unitOfWork.rollbackTransaction();
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  // async update(id: number, tag: Service): Promise<Service> {
  //   try {
  //     await this.unitOfWork.startTransaction();
  //     await (await this.unitOfWork.getRepository(Service)).update(id, tag);
  //     await this.unitOfWork.commitTransaction();
  //     return tag;
  //   } catch (error) {
  //     await this.unitOfWork.rollbackTransaction();
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  // async delete(id: number): Promise<void> {
  //   try {
  //     await this.unitOfWork.startTransaction();
  //     await (await this.unitOfWork.getRepository(Service)).delete(id);
  //     await this.unitOfWork.commitTransaction();
  //   } catch (error) {
  //     await this.unitOfWork.rollbackTransaction();
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  // async deleteMultiple(ids: number[]): Promise<void> {
  //   try {
  //     await this.unitOfWork.startTransaction();
  //     const repo = await this.unitOfWork.getRepository(Service);
  //     ids.forEach(async (id) => await repo.delete(id));
  //     await this.unitOfWork.commitTransaction();
  //   } catch (error) {
  //     await this.unitOfWork.rollbackTransaction();
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
}
