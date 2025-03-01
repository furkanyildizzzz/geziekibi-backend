import { Tag } from 'orm/entities/tag/Tag';
import { IBaseRepository } from 'shared/interfaces/IBaseRepository';

export interface ITagRepository extends IBaseRepository<Tag>{
  getByName(name: string): Promise<Tag | void>;
  getBySeoLink(seoLink: string): Promise<Tag | void>;
}
