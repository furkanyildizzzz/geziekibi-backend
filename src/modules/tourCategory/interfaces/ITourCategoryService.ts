import { CreateTourCategoryDto } from '../dto/CreateTourCategoryDto';
import { TourCategorySuccessDto } from '../dto/TourCategorySuccessDto';

export interface ITourCategoryService {
  getAll(): Promise<TourCategorySuccessDto[]>;
  getById(id: string): Promise<TourCategorySuccessDto>;
  createTourCategory(tourCategoryData: CreateTourCategoryDto): Promise<TourCategorySuccessDto>;
  updateTourCategory(id: string, tourCategoryData: CreateTourCategoryDto): Promise<TourCategorySuccessDto>;
  deleteTourCategory(id: string): Promise<void>;
}
