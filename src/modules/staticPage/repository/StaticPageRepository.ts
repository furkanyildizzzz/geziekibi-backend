import { inject, injectable } from 'inversify';
import { IStaticPageRepository } from '../interfaces/IStaticPageRepository';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { InternalServerErrorException } from 'shared/errors/allException';
import { StaticPage } from 'orm/entities/static-page/StaticPage';
import { StaticPageType } from 'shared/utils/enum';
import { BaseRepository } from 'shared/repositories/BaseRepository';

@injectable()
export class StaticPageRepository extends BaseRepository<StaticPage> implements IStaticPageRepository {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) unitOfWork: UnitOfWork) {
    super(unitOfWork, StaticPage)
  }

  // public async getAll(): Promise<StaticPage[] | void> {
  //   try {
  //     const repo = await this.unitOfWork.getRepository(StaticPage);
  //     const staticPages = await repo.find();
  //     return staticPages;
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
  // public async getById(id: number): Promise<StaticPage | void> {
  //   try {
  //     const repo = await this.unitOfWork.getRepository(StaticPage);
  //     const staticPage = await repo.findOne({
  //       where: { id: id },
  //     });
  //     if (staticPage) return staticPage as StaticPage;
  //   } catch (error) {
  //     throw new InternalServerErrorException(`${error.message}`);
  //   }
  // }

  public async getByType(pageType: StaticPageType): Promise<StaticPage | void> {
    try {
      // const repo = await this.unitOfWork.getRepository(StaticPage);
      // const staticPage = await repo.findOne({
      //   where: { pageType: pageType },
      // });

      const staticPage = await this.findOneByField("pageType", pageType)
      if (staticPage) return staticPage as StaticPage;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }
  // public async save(newStaticPage: StaticPage): Promise<StaticPage> {
  //   try {
  //     await this.unitOfWork.startTransaction();
  //     await (await this.unitOfWork.getRepository(StaticPage)).save(newStaticPage);
  //     await this.unitOfWork.commitTransaction();
  //     return newStaticPage;
  //   } catch (error) {
  //     await this.unitOfWork.rollbackTransaction();
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
  // public async update(id: number, staticPage: StaticPage): Promise<StaticPage> {
  //   try {
  //     await this.unitOfWork.startTransaction();
  //     await (await this.unitOfWork.getRepository(StaticPage)).save({ id, ...staticPage });
  //     await this.unitOfWork.commitTransaction();
  //     return staticPage;
  //   } catch (error) {
  //     await this.unitOfWork.rollbackTransaction();
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
  // public async delete(id: number): Promise<void> {
  //   try {
  //     await this.unitOfWork.startTransaction();
  //     await (await this.unitOfWork.getRepository(StaticPage)).delete(id);
  //     await this.unitOfWork.commitTransaction();
  //   } catch (error) {
  //     await this.unitOfWork.rollbackTransaction();
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
}
