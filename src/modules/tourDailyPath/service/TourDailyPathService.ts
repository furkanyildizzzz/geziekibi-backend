import { inject, injectable } from 'inversify';
import { INTERFACE_TYPE } from 'core/types';
import { BadRequestException, NotFoundException } from 'shared/errors/allException';
import { Service } from 'orm/entities/service/Service';
import { plainToInstance } from 'class-transformer';
import { TourDailyPathSuccessDto } from '../dto/TourDailyPathSuccessDto';
import { ITourDailyPathService } from '../interfaces/ITourDailyPathService';
import { ITourDailyPathRepository } from '../interfaces/ITourDailyPathRepository';
import { CreateTourDailyPathDto } from '../dto/CreateTourDailyPathDto';
import { DeleteMultipleTourDailyPathDto } from '../dto/DeleteMultipleTourDailyPathDto';
import { Transactional } from 'shared/decorators/Transactional';

@injectable()
export class TourDailyPathService implements ITourDailyPathService {
  constructor(@inject(INTERFACE_TYPE.ITourDailyPathRepository) private readonly repository: ITourDailyPathRepository) { }

  public async getAll(): Promise<TourDailyPathSuccessDto[]> {
    const tourPaths = await this.repository.getAll();
    if (tourPaths && tourPaths.length)
      return plainToInstance(TourDailyPathSuccessDto, tourPaths, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    return [];
  }

  public async getById(id: string): Promise<TourDailyPathSuccessDto> {
    const tourPath = await this.repository.getById(Number(id));
    if (!tourPath) throw new NotFoundException(`Tour Path with id:${id} not found`);
    return plainToInstance(TourDailyPathSuccessDto, tourPath, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  @Transactional()
  public async createTourDailyPath(tourPathData: CreateTourDailyPathDto): Promise<TourDailyPathSuccessDto> {
    const newTourPath = new Service();
    const tourPath = await this.repository.getByName(tourPathData.name);
    if (tourPath) throw new BadRequestException(`TourPath '${tourPath.name}' already exists`);
    newTourPath.name = tourPathData.name;
    return await this.repository.create(newTourPath);
  }

  @Transactional()
  public async updateTourDailyPath(id: string, tourPathData: CreateTourDailyPathDto): Promise<TourDailyPathSuccessDto> {

    const tourPath = await this.repository.getById(Number(id));
    if (!tourPath) throw new NotFoundException(`Tour Path with id:'${id}' is not found`);

    if (tourPath.name !== tourPathData.name) {
      const tourPathByName = await this.repository.getByName(tourPathData.name);
      if (tourPathByName) throw new BadRequestException(`Tour Path '${tourPathData.name}' is already exists`);
    }
    tourPath.name = tourPathData.name;
    await this.repository.update(Number(id), tourPath);
    return plainToInstance(TourDailyPathSuccessDto, tourPath, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async deleteTourDailyPath(id: string): Promise<void> {
    const tourPath = await this.repository.getById(Number(id));
    if (!tourPath) throw new NotFoundException(`Tour Path with id:'${id}' is not found`);
    await this.repository.delete(Number(id));
  }

  public async deleteMultipleTourDailyPath(services: DeleteMultipleTourDailyPathDto): Promise<void> {
    await this.repository.deleteMultiple(services.ids);
  }
}
