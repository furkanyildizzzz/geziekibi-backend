import { CreateServiceDto } from '../dto/CreateServiceDto';
import { DeleteMultipleServiceDto } from '../dto/DeleteMultipleServiceDto';
import { ServiceSuccessDto } from '../dto/ServiceSuccessDto';

export interface IServiceInteractor {
  getAll(): Promise<ServiceSuccessDto[]>;
  getById(id: string): Promise<ServiceSuccessDto>;
  createService(serviceData: CreateServiceDto): Promise<ServiceSuccessDto>;
  updateService(id: string, serviceData: CreateServiceDto): Promise<ServiceSuccessDto>;
  deleteService(id: string): Promise<void>;
  deleteMultipleService(services: DeleteMultipleServiceDto): Promise<void>;
}
