import { Tag } from 'orm/entities/tag/Tag';

export interface ITagRepository {
  getAll(): Promise<Tag[] | void>;
  getById(id: number): Promise<Tag | void>;
  getByName(name: string): Promise<Tag | void>;
  create(newTag: Tag): Promise<Tag>;
  update(id: number, tag: Tag): Promise<Tag>;
  delete(id: number): Promise<void>;
  deleteMultiple(ids: number[]): Promise<void>;
}
