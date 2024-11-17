import { TagSuccessDTO } from 'modules/tag/dto/TagSuccessDTO';

export interface ITagService {
  getAll(): Promise<TagSuccessDTO[]>;
  getById(id: string): Promise<TagSuccessDTO>;
}
