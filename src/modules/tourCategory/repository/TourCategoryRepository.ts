import { TourCategory } from 'orm/entities/tour/TourCategory';
import { ITourCategoryRepository } from '../interfaces/ITourCategoryRepository';
import { inject, injectable } from 'inversify';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { InternalServerErrorException } from 'shared/errors/allException';

@injectable()
export class TourCategoryRepository implements ITourCategoryRepository {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork) {}

  public async getAll(): Promise<TourCategory[] | void> {
    try {
      const repo = await this.unitOfWork.getRepository(TourCategory);
      const tourCategories = await repo.find({ relations: ['parent'] });
      if (tourCategories) return tourCategories as TourCategory[];
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  public async getById(id: number): Promise<TourCategory | void> {
    try {
      const repo = await this.unitOfWork.getRepository(TourCategory);
      const tourCategory = await repo.findOne({ where: { id: id }, relations: ['parent', 'subCategories'] });
      if (tourCategory) return tourCategory as TourCategory;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }
  public async getByName(name: string): Promise<TourCategory | void> {
    try {
      const repo = await this.unitOfWork.getRepository(TourCategory);
      const tourCategory = await repo.findOne({ where: { name: name }, relations: ['parent', 'subCategories'] });
      if (tourCategory) return tourCategory as TourCategory;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }
  public async create(newTourCategory: TourCategory): Promise<TourCategory> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(TourCategory)).save(newTourCategory);
      await this.unitOfWork.commitTransaction();
      return newTourCategory;
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }

  public async update(id: number, tourCategory: TourCategory): Promise<TourCategory> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(TourCategory)).save({ id, ...tourCategory });
      await this.unitOfWork.commitTransaction();
      return tourCategory;
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }
  public async delete(id: number): Promise<void> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(TourCategory)).delete(id);
      await this.unitOfWork.commitTransaction();
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }
}
