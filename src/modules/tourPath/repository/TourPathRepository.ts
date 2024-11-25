import { inject, injectable } from 'inversify';
import { ITourPathRepository } from '../interfaces/ITourPathRepository';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { InternalServerErrorException } from 'shared/errors/allException';
import { TourPath } from 'orm/entities/tour/TourPath';

@injectable()
export class TourPathRepository implements ITourPathRepository {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork) {}

  async getAll(): Promise<TourPath[] | void> {
    try {
      const repo = await this.unitOfWork.getRepository(TourPath);
      const tags = await repo.find();
      if (tags) return tags as TourPath[];
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  async getById(id: number): Promise<TourPath | void> {
    try {
      const repo = await this.unitOfWork.getRepository(TourPath);
      const tag = await repo.findOne({ where: { id: id } });
      if (tag) return tag as TourPath;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  async getByName(name: string): Promise<TourPath | void> {
    try {
      const repo = await this.unitOfWork.getRepository(TourPath);
      const tag = await repo.findOne({ where: { name: name } });
      if (tag) return tag as TourPath;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  async create(newTourPath: TourPath): Promise<TourPath> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(TourPath)).save(newTourPath);
      await this.unitOfWork.commitTransaction();
      return newTourPath;
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, tag: TourPath): Promise<TourPath> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(TourPath)).update(id, tag);
      await this.unitOfWork.commitTransaction();
      return tag;
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(TourPath)).delete(id);
      await this.unitOfWork.commitTransaction();
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteMultiple(ids: number[]): Promise<void> {
    try {
      await this.unitOfWork.startTransaction();
      const repo = await this.unitOfWork.getRepository(TourPath);
      ids.forEach(async (id) => await repo.delete(id));
      await this.unitOfWork.commitTransaction();
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }
}
