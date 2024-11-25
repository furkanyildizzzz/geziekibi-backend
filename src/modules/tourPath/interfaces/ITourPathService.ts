import { CreateTourPathDto } from '../dto/CreateTourPathDto';
import { DeleteMultipleTourPathDto } from '../dto/DeleteMultipleTourPathDto';
import { TourPathSuccessDto } from '../dto/TourPathSuccessDto';

export interface ITourPathService {
  getAll(): Promise<TourPathSuccessDto[]>;
  getById(id: string): Promise<TourPathSuccessDto>;
  createTourPath(data: CreateTourPathDto): Promise<TourPathSuccessDto>;
  updateTourPath(id: string, data: CreateTourPathDto): Promise<TourPathSuccessDto>;
  deleteTourPath(id: string): Promise<void>;
  deleteMultipleTourPath(services: DeleteMultipleTourPathDto): Promise<void>;
}
