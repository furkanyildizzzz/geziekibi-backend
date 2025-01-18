import { FeaturedTourDto } from 'modules/website-modules/homepage/dto/FeaturedTourDto';
import { TourDtoWeb } from '../dto/TourDtoWeb';
import { SearchTourDto } from '../dto/SearchTourDto';
import { CategoryDto } from 'modules/website-modules/homepage/dto/CategoryDto';

export interface ITourServiceWeb {
  getAll(categoryId: string | null): Promise<FeaturedTourDto[]>;
  searchTours(searchParams: SearchTourDto): Promise<FeaturedTourDto[]>;
  getBySeoLink(seoLink: string): Promise<TourDtoWeb>;
  getCategoryBySeoLink(seoLink: string): Promise<CategoryDto>;
}
