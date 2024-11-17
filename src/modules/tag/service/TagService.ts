import { TagSuccessDTO } from 'modules/tag/dto/TagSuccessDTO';
import { ITagService } from 'modules/tag/interfaces/ITagService';
import { ITagRepository } from 'modules/tag/interfaces/ITagRepository';
import { inject, injectable } from 'inversify';
import { Tag } from 'orm/entities/tag/Tag';
import { NotFoundException } from 'shared/errors/allException';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { INTERFACE_TYPE } from 'core/types';

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
    throw new NotFoundException('Tag not found');
  }

  public async getById(id: string): Promise<TagSuccessDTO> {
    const tag = await this.repository.getById(Number(id));
    if (tag) return tag as TagSuccessDTO;
    throw new NotFoundException('Tag not found');
  }

  async createTag(tagData: Partial<Tag>): Promise<Tag> {
    const tag = new Tag();
    tag.name = tagData.name;

    try {
      await this.unitOfWork.startTransaction();
      await this.unitOfWork.getRepository(Tag).save(tag);
      await this.unitOfWork.commitTransaction();
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw error;
    }

    return tag;
  }
}
