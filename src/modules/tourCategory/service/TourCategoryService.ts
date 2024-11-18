import { inject } from 'inversify';
import { ITourCategoryService } from '../interfaces/ITourCategoryService';
import { INTERFACE_TYPE } from 'core/types';
import { ITourCategoryRepository } from '../interfaces/ITourCategoryRepository';
import { CreateTourCategoryDto } from '../dto/CreateTourCategoryDto';
import { TourCategorySuccessDto } from '../dto/TourCategorySuccessDto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { BadRequestException, NotFoundException } from 'shared/errors/allException';
import { TourCategory } from 'orm/entities/tour/TourCategory';

export class TourCategoryService implements ITourCategoryService {
  constructor(@inject(INTERFACE_TYPE.ITourCategoryRepository) private readonly repository: ITourCategoryRepository) {}

  public async getAll(): Promise<TourCategorySuccessDto[]> {
    const tourCategories = await this.repository.getAll();
    if (tourCategories && tourCategories.length)
      return plainToInstance(TourCategorySuccessDto, tourCategories, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    return [];
  }

  public async getById(id: string): Promise<TourCategorySuccessDto> {
    const tourCategory = await this.repository.getById(Number(id));
    if (!tourCategory) throw new NotFoundException(`Tour Category with id:${id} not found`);
    return plainToInstance(TourCategorySuccessDto, tourCategory, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }
  public async createTourCategory(tourCategoryData: CreateTourCategoryDto): Promise<TourCategorySuccessDto> {
    console.log({ parentId: tourCategoryData.parentId });
    const newTourCategory = new TourCategory();
    const tourCategory = await this.repository.getByName(tourCategoryData.name);
    if (tourCategory) throw new BadRequestException(`Tour Category '${tourCategoryData.name}' is already exists`);
    newTourCategory.name = tourCategoryData.name;

    if (tourCategoryData.parentId > 0) {
      const parentTourCategory = await this.repository.getById(tourCategoryData.parentId);
      if (!parentTourCategory)
        throw new NotFoundException(`Parent Tour Category with id:${tourCategoryData.parentId} not found`);
      newTourCategory.parent = parentTourCategory;
    }

    newTourCategory.description = tourCategoryData.description;
    return await this.repository.create(newTourCategory);
  }
  public async updateTourCategory(
    id: string,
    tourCategoryData: CreateTourCategoryDto,
  ): Promise<TourCategorySuccessDto> {
    const tourCategory = await this.repository.getById(Number(id));
    if (!tourCategory) throw new NotFoundException(`Tour Category with id:'${id}' is not found`);

    if (tourCategory.name !== tourCategoryData.name) {
      const tourCategoryByName = await this.repository.getByName(tourCategoryData.name);
      if (tourCategoryByName)
        throw new BadRequestException(`Tour Category '${tourCategoryData.name}' is already exists`);
    }
    tourCategory.name = tourCategoryData.name;

    if (tourCategoryData.parentId) {
      const parentTourCategory = await this.repository.getById(tourCategoryData.parentId);
      if (!parentTourCategory)
        throw new NotFoundException(`Parent Tour Category with id:${tourCategoryData.parentId} not found`);
      tourCategory.parent = parentTourCategory;
    } else {
      tourCategory.parent = null;
    }

    tourCategory.description = tourCategoryData.description;

    await this.repository.update(Number(id), tourCategory);
    return plainToInstance(TourCategorySuccessDto, tourCategory, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }
  public async deleteTourCategory(id: string): Promise<void> {
    const tourCategory = await this.repository.getById(Number(id));
    if (!tourCategory) throw new NotFoundException(`Tour Category with id:'${id}' is not found`);
    await this.repository.delete(Number(id));
  }
}
