import { inject, injectable } from 'inversify';
import { ITourDailyPathRepository } from '../interfaces/ITourDailyPathRepository';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { InternalServerErrorException } from 'shared/errors/allException';
import { TourDailyPath } from 'orm/entities/tour/TourDailyPath';

@injectable()
export class TourDailyPathRepository implements ITourDailyPathRepository {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork) {}

  async getAll(): Promise<TourDailyPath[] | void> {
    try {
      const repo = await this.unitOfWork.getRepository(TourDailyPath);
      const tags = await repo.find();
      if (tags) return tags as TourDailyPath[];
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  async getById(id: number): Promise<TourDailyPath | void> {
    try {
      const repo = await this.unitOfWork.getRepository(TourDailyPath);
      const tag = await repo.findOne({ where: { id: id } });
      if (tag) return tag as TourDailyPath;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  async getByName(name: string): Promise<TourDailyPath | void> {
    try {
      const repo = await this.unitOfWork.getRepository(TourDailyPath);
      const tag = await repo.findOne({ where: { name: name } });
      if (tag) return tag as TourDailyPath;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  async create(newTourPath: TourDailyPath): Promise<TourDailyPath> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(TourDailyPath)).save(newTourPath);
      await this.unitOfWork.commitTransaction();
      return newTourPath;
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, tag: TourDailyPath): Promise<TourDailyPath> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(TourDailyPath)).update(id, tag);
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
      await (await this.unitOfWork.getRepository(TourDailyPath)).delete(id);
      await this.unitOfWork.commitTransaction();
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteMultiple(ids: number[]): Promise<void> {
    try {
      await this.unitOfWork.startTransaction();
      const repo = await this.unitOfWork.getRepository(TourDailyPath);
      ids.forEach(async (id) => await repo.delete(id));
      await this.unitOfWork.commitTransaction();
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }
}
