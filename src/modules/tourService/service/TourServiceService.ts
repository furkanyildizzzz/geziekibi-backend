import { inject, injectable } from 'inversify';
import { ITourServiceService } from '../interfaces/ITourServiceService';
import { INTERFACE_TYPE } from 'core/types';
import { ITourServiceRepository } from '../interfaces/ITourServiceRepository';
import { CreateTourServiceDto } from '../dto/CreateTourServiceDto';
import { TourServiceSuccessDto } from '../dto/TourServiceSuccessDto';
import { BadRequestException, NotFoundException } from 'shared/errors/allException';
import { Service } from 'orm/entities/service/Service';
import { DeleteMultipleServiceDto } from '../dto/DeleteMultipleServiceDto';

@injectable()
export class TourServiceService implements ITourServiceService {
  constructor(@inject(INTERFACE_TYPE.ITourServiceRepository) private readonly repository: ITourServiceRepository) {}

  public async getAll(): Promise<TourServiceSuccessDto[]> {
    const tags = await this.repository.getAll();
    if (tags && tags.length) return tags as TourServiceSuccessDto[];
    // throw new NotFoundException('No tags found');
    return [];
  }

  public async getById(id: string): Promise<TourServiceSuccessDto> {
    const tag = await this.repository.getById(Number(id));
    if (tag) return tag as TourServiceSuccessDto;
    throw new NotFoundException('TourService not found');
  }

  async createTourService(tagData: CreateTourServiceDto): Promise<Service> {
    const tag = await this.repository.getByName(tagData.name);
    if (tag) throw new BadRequestException(`Service '${tag.name}' is already exists`);

    const newService = new Service();
    newService.name = tagData.name;
    return await this.repository.create(newService);
  }

  async updateTourService(id: string, tagData: CreateTourServiceDto): Promise<Service> {
    const tag = await this.repository.getById(Number(id));
    if (!tag) throw new NotFoundException(`Service with id:'${id}' is not found`);
    tag.name = tagData.name;
    return await this.repository.update(Number(id), tag);
  }

  async deleteTourService(id: string): Promise<void> {
    const tag = await this.repository.getById(Number(id));
    if (!tag) throw new NotFoundException(`Service with id:'${id}' is not found`);
    await this.repository.delete(Number(id));
  }

  async deleteMultipleService(tags: DeleteMultipleServiceDto): Promise<void> {
    console.log({ tags });
    await this.repository.deleteMultiple(tags.ids);
  }
}
