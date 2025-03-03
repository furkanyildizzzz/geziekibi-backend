import { HomepageSlider } from 'orm/entities/homepageSlider/HomepageSlider';
import { IHomepageSliderRepository } from '../interfaces/IHomepageSliderRepository';
import { inject, injectable } from 'inversify';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { InternalServerErrorException } from 'shared/errors/allException';
import { BaseRepository } from 'shared/repositories/BaseRepository';

@injectable()
export class HomepageSliderRepository extends BaseRepository<HomepageSlider> implements IHomepageSliderRepository {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) unitOfWork: UnitOfWork) {
    super(unitOfWork, HomepageSlider)
  }

  // public async getAll(): Promise<HomepageSlider[] | void> {
  //   try {
  //     const repo = await this.unitOfWork.getRepository(HomepageSlider);
  //     const homepageSliders = await repo.find({ relations: ['image'] });
  //     if (homepageSliders) return homepageSliders as HomepageSlider[];
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
  // public async getById(id: number): Promise<HomepageSlider | void> {
  //   try {
  //     const repo = await this.unitOfWork.getRepository(HomepageSlider);
  //     const homepageSlider = await repo.findOne({
  //       where: { id: id },
  //       relations: ['image'],
  //     });
  //     if (homepageSlider) return homepageSlider as HomepageSlider;
  //   } catch (error) {
  //     throw new InternalServerErrorException(`${error.message}`);
  //   }
  // }
  // public async create(newHomepageSlider: HomepageSlider): Promise<HomepageSlider> {
  //   try {
  //     await this.unitOfWork.startTransaction();
  //     await (await this.unitOfWork.getRepository(HomepageSlider)).save(newHomepageSlider);
  //     await this.unitOfWork.commitTransaction();
  //     return newHomepageSlider;
  //   } catch (error) {
  //     await this.unitOfWork.rollbackTransaction();
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  // public async update(id: number, homepageSlider: HomepageSlider): Promise<HomepageSlider> {
  //   try {
  //     await this.unitOfWork.startTransaction();
  //     await (await this.unitOfWork.getRepository(HomepageSlider)).save({ id, ...homepageSlider });
  //     await this.unitOfWork.commitTransaction();
  //     return homepageSlider;
  //   } catch (error) {
  //     await this.unitOfWork.rollbackTransaction();
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
  // public async delete(id: number): Promise<void> {
  //   try {
  //     await this.unitOfWork.startTransaction();
  //     await (await this.unitOfWork.getRepository(HomepageSlider)).delete(id);
  //     await this.unitOfWork.commitTransaction();
  //   } catch (error) {
  //     await this.unitOfWork.rollbackTransaction();
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
}
