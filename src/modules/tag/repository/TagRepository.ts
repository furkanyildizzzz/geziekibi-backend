import { AppDataSource } from 'config/database';
import { ITagRepository } from 'modules/tag/interfaces/ITagRepository';
import { inject, injectable } from 'inversify';
import { Tag } from 'orm/entities/tag/Tag';
import { IDatabaseService } from 'core/interface/IDatabaseService';
import { InternalServerErrorException, NotFoundException } from 'shared/errors/allException';
import { getRepository, Repository } from 'typeorm';
import { INTERFACE_TYPE } from 'core/types';

@injectable()
export class TagRepository implements ITagRepository {
  constructor(@inject(INTERFACE_TYPE.IDatabaseService) private readonly database: IDatabaseService) {}

  private get repo(): Repository<Tag> {
    return AppDataSource.getRepository(Tag);
  }

  async getAll(): Promise<Tag[] | void> {
    try {
      const repo = await this.database.getRepository(Tag);
      const tags = await repo.find();
      if (tags) return tags as Tag[];
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  async getById(id: number): Promise<Tag | void> {
    try {
      const repo = await this.database.getRepository(Tag);
      const tag = await repo.findOne({ where: { id: id } });
      if (tag) return tag as Tag;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }
}
