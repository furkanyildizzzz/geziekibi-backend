import { CategoryDto, FeaturedTourDto } from '../dto/FeaturedTourDto';

export interface IHomepageService {
  getFeaturedTours(): Promise<FeaturedTourDto[]>;
  getCategories(): Promise<CategoryDto[]>;
  getTopTours(): Promise<FeaturedTourDto[]>;
}
