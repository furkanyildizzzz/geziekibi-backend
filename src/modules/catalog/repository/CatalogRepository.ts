import { Catalog } from 'orm/entities/catalog/Catalog';
import { ICatalogRepository } from '../interfaces/ICatalogRepository';
import { inject, injectable } from 'inversify';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { InternalServerErrorException } from 'shared/errors/allException';

@injectable()
export class CatalogRepository implements ICatalogRepository {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork) {}

  public async getAll(): Promise<Catalog[] | void> {
    try {
      const repo = await this.unitOfWork.getRepository(Catalog);
      const catalogs = await repo.find();
      if (catalogs) return catalogs as Catalog[];
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  public async getById(id: number): Promise<Catalog | void> {
    try {
      const repo = await this.unitOfWork.getRepository(Catalog);
      const catalog = await repo.findOne({
        where: { id: id },
      });
      if (catalog) return catalog as Catalog;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }
  public async getByPublicId(publicId: string): Promise<Catalog | void> {
    try {
      const repo = await this.unitOfWork.getRepository(Catalog);
      const catalog = await repo.findOne({ where: { publicId: publicId } });
      if (catalog) return catalog as Catalog;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }
  public async getBySeoLink(seoLink: string): Promise<Catalog | void> {
    try {
      const repo = await this.unitOfWork.getRepository(Catalog);
      const catalog = await repo.findOne({ where: { seoLink: seoLink } });
      if (catalog) return catalog as Catalog;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  public async create(newCatalog: Catalog): Promise<Catalog> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(Catalog)).save(newCatalog);
      await this.unitOfWork.commitTransaction();
      return newCatalog;
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }

  public async update(id: number, catalog: Catalog): Promise<Catalog> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(Catalog)).save({ id, ...catalog });
      await this.unitOfWork.commitTransaction();
      return catalog;
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }

  public async delete(id: number): Promise<void> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(Catalog)).delete(id);
      await this.unitOfWork.commitTransaction();
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }
}
