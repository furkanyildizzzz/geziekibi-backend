import { CreateTourDto } from '../dto/CreateTourDto';
import { EditTourDto } from '../dto/EditTourDto';
import { TourDto } from '../dto/TourDto';
import { TourListDto } from '../dto/TourListDto';

export interface ITourService {
  getAll(): Promise<TourListDto[]>;
  getById(id: string): Promise<TourDto>;
  createTour(tourData: CreateTourDto): Promise<TourDto>;
  updateTour(id: string, tourData: EditTourDto): Promise<TourDto>;
  deleteTour(id: string): Promise<void>;
  uploadBodyImage(files: Express.Multer.File): Promise<string>;
}
