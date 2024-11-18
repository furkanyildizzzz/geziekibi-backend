import { AppDataSource } from 'config/database';
import { ITagRepository } from 'modules/tag/interfaces/ITagRepository';
import { inject, injectable } from 'inversify';
import { Tag } from 'orm/entities/tag/Tag';
import { IDatabaseService } from 'core/interface/IDatabaseService';
import { InternalServerErrorException, NotFoundException } from 'shared/errors/allException';
import { getRepository, Repository } from 'typeorm';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';

@injectable()
export class TagRepository implements ITagRepository {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork) {}

  async getAll(): Promise<Tag[] | void> {
    try {
      const repo = await this.unitOfWork.getRepository(Tag);
      const tags = await repo.find();
      if (tags) return tags as Tag[];
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  async getById(id: number): Promise<Tag | void> {
    try {
      const repo = await this.unitOfWork.getRepository(Tag);
      const tag = await repo.findOne({ where: { id: id } });
      if (tag) return tag as Tag;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  async getByName(name: string): Promise<Tag | void> {
    try {
      const repo = await this.unitOfWork.getRepository(Tag);
      const tag = await repo.findOne({ where: { name: name } });
      if (tag) return tag as Tag;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  async create(newTag: Tag): Promise<Tag> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(Tag)).save(newTag);
      await this.unitOfWork.commitTransaction();
      return newTag;
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, tag: Tag): Promise<Tag> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(Tag)).update(id, tag);
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
      await (await this.unitOfWork.getRepository(Tag)).delete(id);
      await this.unitOfWork.commitTransaction();
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteMultiple(ids: number[]): Promise<void> {
    try {
      await this.unitOfWork.startTransaction();
      const repo = await this.unitOfWork.getRepository(Tag);
      ids.forEach(async (id) => await repo.delete(id));
      await this.unitOfWork.commitTransaction();
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }
}
