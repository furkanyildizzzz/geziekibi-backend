import { Tag } from 'orm/entities/tag/Tag';

export interface ITagRepository {
  getAll(): Promise<Tag[] | void>;
  getById(id: number): Promise<Tag | void>;
}
