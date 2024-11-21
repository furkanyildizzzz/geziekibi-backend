import { TagSuccessDTO } from 'modules/tag/dto/TagSuccessDTO';
import { ITagService } from 'modules/tag/interfaces/ITagService';
import { ITagRepository } from 'modules/tag/interfaces/ITagRepository';
import { inject, injectable, named } from 'inversify';
import { Tag } from 'orm/entities/tag/Tag';
import { BadRequestException, NotFoundException } from 'shared/errors/allException';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { INTERFACE_TYPE } from 'core/types';
import { CreateTagDto } from '../dto/CreateTagDto';
import { BadRequestErrorMessageResult } from 'inversify-express-utils/lib/results';
import { DeleteMultipleTagDto } from '../dto/DeleteMultipleTagDto';

@injectable()
export class TagService implements ITagService {
  private repository: ITagRepository;
  private unitOfWork: UnitOfWork;

  constructor(
    @inject(INTERFACE_TYPE.UnitOfWork) unitOfWork: UnitOfWork,
    @inject(INTERFACE_TYPE.ITagRepository) repository,
  ) {
    this.repository = repository;
    this.unitOfWork = unitOfWork;
  }

  public async getAll(): Promise<TagSuccessDTO[]> {
    const tags = await this.repository.getAll();
    if (tags && tags.length) return tags as TagSuccessDTO[];
    // throw new NotFoundException('No tags found');
    return [];
  }

  public async getById(id: string): Promise<TagSuccessDTO> {
    const tag = await this.repository.getById(Number(id));
    if (tag) return tag as TagSuccessDTO;
    throw new NotFoundException('Tag not found');
  }

  async createTag(tagData: CreateTagDto): Promise<Tag> {
    const tag = await this.repository.getByName(tagData.name);
    if (tag) throw new BadRequestException(`Tag '${tag.name}' is already exists`);

    const newTag = new Tag();
    newTag.name = tagData.name;
    return await this.repository.create(newTag);
  }

  async updateTag(id: string, tagData: CreateTagDto): Promise<Tag> {
    const tag = await this.repository.getById(Number(id));
    if (!tag) throw new NotFoundException(`Tag with id:'${id}' is not found`);
    tag.name = tagData.name;
    return await this.repository.update(Number(id), tag);
  }

  async deleteTag(id: string): Promise<void> {
    const tag = await this.repository.getById(Number(id));
    if (!tag) throw new NotFoundException(`Tag with id:'${id}' is not found`);
    await this.repository.delete(Number(id));
  }

  async deleteMultipleTag(tags: DeleteMultipleTagDto): Promise<void> {
    await this.repository.deleteMultiple(tags.ids);
  }
}