import { inject, injectable } from 'inversify';
import { ITourPathService } from '../interfaces/ITourPathService';
import { INTERFACE_TYPE } from 'core/types';
import { ITourPathRepository } from '../interfaces/ITourPathRepository';
import { CreateTourPathDto } from '../dto/CreateTourPathDto';
import { TourPathSuccessDto } from '../dto/TourPathSuccessDto';
import { BadRequestException, NotFoundException } from 'shared/errors/allException';
import { Service } from 'orm/entities/service/Service';
import { DeleteMultipleTourPathDto } from '../dto/DeleteMultipleTourPathDto';
import { plainToInstance } from 'class-transformer';

@injectable()
export class TourPathService implements ITourPathService {
  constructor(@inject(INTERFACE_TYPE.ITourPathRepository) private readonly repository: ITourPathRepository) {}

  public async getAll(): Promise<TourPathSuccessDto[]> {
    const tourPaths = await this.repository.getAll();
    if (tourPaths && tourPaths.length)
      return plainToInstance(TourPathSuccessDto, tourPaths, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    return [];
  }

  public async getById(id: string): Promise<TourPathSuccessDto> {
    const tourPath = await this.repository.getById(Number(id));
    if (!tourPath) throw new NotFoundException(`Tour Path with id:${id} not found`);
    return plainToInstance(TourPathSuccessDto, tourPath, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async createTourPath(tourPathData: CreateTourPathDto): Promise<TourPathSuccessDto> {
    const newTourPath = new Service();
    const tourPath = await this.repository.getByName(tourPathData.name);
    if (tourPath) throw new BadRequestException(`TourPath '${tourPath.name}' already exists`);
    newTourPath.name = tourPathData.name;
    return await this.repository.create(newTourPath);
  }

  public async updateTourPath(id: string, tourPathData: CreateTourPathDto): Promise<TourPathSuccessDto> {
    const tourPath = await this.repository.getById(Number(id));
    if (!tourPath) throw new NotFoundException(`Tour Path with id:'${id}' is not found`);

    if (tourPath.name !== tourPathData.name) {
      const tourPathByName = await this.repository.getByName(tourPathData.name);
      if (tourPathByName) throw new BadRequestException(`Tour Path '${tourPathData.name}' is already exists`);
    }
    tourPath.name = tourPathData.name;
    await this.repository.update(Number(id), tourPath);
    return plainToInstance(TourPathSuccessDto, tourPath, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async deleteTourPath(id: string): Promise<void> {
    const tourPath = await this.repository.getById(Number(id));
    if (!tourPath) throw new NotFoundException(`Tour Path with id:'${id}' is not found`);
    await this.repository.delete(Number(id));
  }

  public async deleteMultipleTourPath(services: DeleteMultipleTourPathDto): Promise<void> {
    await this.repository.deleteMultiple(services.ids);
  }
}
