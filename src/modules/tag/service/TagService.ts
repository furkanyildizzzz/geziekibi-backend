import { TagSuccessDTO } from 'modules/tag/dto/TagSuccessDTO';
import { ITagService } from 'modules/tag/interfaces/ITagService';
import { ITagRepository } from 'modules/tag/interfaces/ITagRepository';
import { inject, injectable, named } from 'inversify';
import { Tag } from 'orm/entities/tag/Tag';
import { BadRequestException, InternalServerErrorException, NotFoundException } from 'shared/errors/allException';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { INTERFACE_TYPE } from 'core/types';
import { CreateTagDto } from '../dto/CreateTagDto';
import { BadRequestErrorMessageResult } from 'inversify-express-utils/lib/results';
import { DeleteMultipleTagDto } from '../dto/DeleteMultipleTagDto';
import { ISeoLinkService } from 'shared/interfaces/ISeoLinkService';
import { Transactional } from 'shared/decorators/Transactional';

@injectable()
export class TagService implements ITagService {

  constructor(
    @inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork,
    @inject(INTERFACE_TYPE.ITagRepository) private readonly repository: ITagRepository,
    @inject(INTERFACE_TYPE.ISeoLinkService) private readonly seoLinkService: ISeoLinkService,
  ) {
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
    throw new NotFoundException('tag_id_not_found', { id });
  }

  public async getBySeoLink(seoLink: string): Promise<TagSuccessDTO> {
    const tag = await this.repository.getBySeoLink(seoLink);
    if (tag) return tag as TagSuccessDTO;
    throw new NotFoundException('tag_seo_link_not_found', { seoLink });
  }

  @Transactional()
  async createTag(tagData: CreateTagDto): Promise<Tag> {
    const tag = await this.repository.getByName(tagData.name);
    if (tag) throw new BadRequestException(`tag_name_exists`, { name: tagData.name });

    const newTag = new Tag();
    newTag.name = tagData.name;
    newTag.seoLink = await this.seoLinkService.generateUniqueSeoLink(tagData.name, 'tag', newTag.id);

    return await this.repository.create(newTag);
  }

  @Transactional()
  async updateTag(id: string, tagData: CreateTagDto): Promise<Tag> {
    try {
      const tag = await this.repository.getById(Number(id));
      if (!tag) throw new NotFoundException('tag_id_not_found', { id });

      const existingTag = await this.repository.getByName(tagData.name);
      if (existingTag) throw new NotFoundException(`tag_name_exists`, { name: tagData.name });

      tag.name = tagData.name;
      tag.seoLink = await this.seoLinkService.generateUniqueSeoLink(tagData.name, 'tag', tag.id);
      return await this.repository.update(Number(id), tag);
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async deleteTag(id: string): Promise<void> {
    const tag = await this.repository.getById(Number(id));
    if (!tag) throw new NotFoundException('tag_id_not_found', { id });
    await this.repository.delete(Number(id));
  }

  async deleteMultipleTag(tags: DeleteMultipleTagDto): Promise<void> {
    await this.repository.deleteMultiple(tags.ids);
  }
}
