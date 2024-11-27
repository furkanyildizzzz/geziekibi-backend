import { CreateTourDailyPathDto } from '../dto/CreateTourDailyPathDto';
import { DeleteMultipleTourDailyPathDto } from '../dto/DeleteMultipleTourDailyPathDto';
import { TourDailyPathSuccessDto } from '../dto/TourDailyPathSuccessDto';

export interface ITourDailyPathService {
  getAll(): Promise<TourDailyPathSuccessDto[]>;
  getById(id: string): Promise<TourDailyPathSuccessDto>;
  createTourDailyPath(data: CreateTourDailyPathDto): Promise<TourDailyPathSuccessDto>;
  updateTourDailyPath(id: string, data: CreateTourDailyPathDto): Promise<TourDailyPathSuccessDto>;
  deleteTourDailyPath(id: string): Promise<void>;
  deleteMultipleTourDailyPath(services: DeleteMultipleTourDailyPathDto): Promise<void>;
}
