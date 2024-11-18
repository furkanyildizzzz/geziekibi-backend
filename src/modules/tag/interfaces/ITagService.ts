import { TagSuccessDTO } from 'modules/tag/dto/TagSuccessDTO';
import { CreateTagDto } from '../dto/CreateTagDto';
import { DeleteMultipleTagDto } from '../dto/DeleteMultipleTagDto';

export interface ITagService {
  getAll(): Promise<TagSuccessDTO[]>;
  getById(id: string): Promise<TagSuccessDTO>;
  createTag(tagData: CreateTagDto): Promise<TagSuccessDTO>;
  updateTag(id: string, tagData: CreateTagDto): Promise<TagSuccessDTO>;
  deleteTag(id: string): Promise<void>;
  deleteMultipleTag(tags: DeleteMultipleTagDto): Promise<void>;
}
