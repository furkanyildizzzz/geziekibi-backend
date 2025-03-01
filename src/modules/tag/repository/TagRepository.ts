import { ITagRepository } from 'modules/tag/interfaces/ITagRepository';
import { inject, injectable } from 'inversify';
import { Tag } from 'orm/entities/tag/Tag';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { BaseRepository } from 'shared/repositories/BaseRepository';

@injectable()
export class TagRepository extends BaseRepository<Tag> implements ITagRepository {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) unitOfWork: UnitOfWork) {
    super(unitOfWork, Tag);
  }
  async getBySeoLink(seoLink: string): Promise<Tag | null> {
    return this.findOneByField("seoLink", seoLink);
  }

  async getByName(name: string): Promise<Tag | null> {
    return this.findOneByField("name", name);
  }
}
