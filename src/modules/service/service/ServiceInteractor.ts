import { inject, injectable } from 'inversify';
import { IServiceInteractor } from '../interfaces/IServiceInteractor';
import { INTERFACE_TYPE } from 'core/types';
import { IServiceRepository } from '../interfaces/IServiceRepository';
import { CreateServiceDto } from '../dto/CreateServiceDto';
import { ServiceSuccessDto } from '../dto/ServiceSuccessDto';
import { BadRequestException, NotFoundException } from 'shared/errors/allException';
import { Service } from 'orm/entities/service/Service';
import { DeleteMultipleServiceDto } from '../dto/DeleteMultipleServiceDto';
import { plainToInstance } from 'class-transformer';
import { TourService } from 'orm/entities/tour/TourService';

@injectable()
export class ServiceInteractor implements IServiceInteractor {
  constructor(@inject(INTERFACE_TYPE.IServiceRepository) private readonly repository: IServiceRepository) { }

  public async getAll(): Promise<ServiceSuccessDto[]> {
    const tourServices = await this.repository.getAll();
    if (tourServices && tourServices.length)
      return plainToInstance(ServiceSuccessDto, tourServices, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    return [];
  }

  public async getById(id: string): Promise<ServiceSuccessDto> {
    const tourService = await this.repository.getById(Number(id));
    if (!tourService) throw new NotFoundException(`Tour Service with id:${id} not found`);
    return plainToInstance(ServiceSuccessDto, tourService, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async createService(serviceData: CreateServiceDto): Promise<ServiceSuccessDto> {
    const newService = new Service();
    const service = await this.repository.getByName(serviceData.name);
    if (service) throw new BadRequestException(`Service '${service.name}' already exists`);
    newService.name = serviceData.name;
    newService.description = serviceData.description;
    await this.repository.create(newService);
    return plainToInstance(ServiceSuccessDto, service, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async updateService(id: string, serviceData: CreateServiceDto): Promise<ServiceSuccessDto> {
    const service = await this.repository.getById(Number(id));
    if (!service) throw new NotFoundException(`Service with id:'${id}' is not found`);

    if (service.name !== serviceData.name) {
      const serviceByName = await this.repository.getByName(serviceData.name);
      if (serviceByName) throw new BadRequestException(`Service '${serviceData.name}' is already exists`);
    }
    service.name = serviceData.name;
    service.description = serviceData.description;
    await this.repository.update(Number(id), service);
    return plainToInstance(ServiceSuccessDto, service, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async deleteService(id: string): Promise<void> {
    const service = await this.repository.getById(Number(id));
    if (!service) throw new NotFoundException(`Service with id:'${id}' is not found`);
    await this.repository.delete(Number(id));
  }

  public async deleteMultipleService(services: DeleteMultipleServiceDto): Promise<void> {
    await this.repository.deleteMultiple(services.ids);
  }
}
