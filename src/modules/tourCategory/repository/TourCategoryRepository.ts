import { TourCategory } from 'orm/entities/tour/TourCategory';
import { ITourCategoryRepository } from '../interfaces/ITourCategoryRepository';
import { inject, injectable } from 'inversify';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { InternalServerErrorException } from 'shared/errors/allException';
import { BaseRepository } from 'shared/repositories/BaseRepository';

@injectable()
export class TourCategoryRepository extends BaseRepository<TourCategory> implements ITourCategoryRepository {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) unitOfWork: UnitOfWork) {
    super(unitOfWork, TourCategory)

  }

  // public async getAll(): Promise<TourCategory[] | void> {
  //   try {
  //     const repo = await this.unitOfWork.getRepository(TourCategory);
  //     const tourCategories = await repo.find({ relations: ['parent', 'primaryImages'] });
  //     if (tourCategories) return tourCategories as TourCategory[];
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
  // public async getById(id: number): Promise<TourCategory | void> {
  //   try {
  //     const repo = await this.unitOfWork.getRepository(TourCategory);
  //     const tourCategory = await repo.findOne({
  //       where: { id: id },
  //       relations: ['parent', 'subCategories', 'primaryImages'],
  //     });
  //     if (tourCategory) return tourCategory as TourCategory;
  //   } catch (error) {
  //     throw new InternalServerErrorException(`${error.message}`);
  //   }
  // }
  public async getBySeoLink(seoLink: string): Promise<TourCategory | void> {
    try {
      const repo = await this.unitOfWork.getRepository(TourCategory);
      const tourCategory = await repo.findOne({
        where: { seoLink: seoLink },
        relations: ['parent', 'subCategories', 'primaryImages'],
      });
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
}
