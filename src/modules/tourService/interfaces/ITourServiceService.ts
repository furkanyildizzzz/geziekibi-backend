import { CreateTourServiceDto } from '../dto/CreateTourServiceDto';
import { DeleteMultipleServiceDto } from '../dto/DeleteMultipleServiceDto';
import { TourServiceSuccessDto } from '../dto/TourServiceSuccessDto';

export interface ITourServiceService {
  getAll(): Promise<TourServiceSuccessDto[]>;
  getById(id: string): Promise<TourServiceSuccessDto>;
  createTourService(serviceData: CreateTourServiceDto): Promise<TourServiceSuccessDto>;
  updateTourService(id: string, serviceData: CreateTourServiceDto): Promise<TourServiceSuccessDto>;
  deleteTourService(id: string): Promise<void>;
  deleteMultipleService(services: DeleteMultipleServiceDto): Promise<void>;
}
