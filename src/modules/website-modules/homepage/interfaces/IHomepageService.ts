import { BlogDto } from '../dto/BlogDto';
import { DailyPathDto } from '../dto/DailyPathDto';
import { CategoryDto, FeaturedTourDto } from '../dto/FeaturedTourDto';

export interface IHomepageService {
  getFeaturedTours(): Promise<FeaturedTourDto[]>;
  getCategories(): Promise<CategoryDto[]>;
  getTopTours(): Promise<FeaturedTourDto[]>;
  getBlogs(): Promise<BlogDto[]>;
  getDailyPaths(): Promise<DailyPathDto[]>;
}
