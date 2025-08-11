import { StaticPageType } from 'shared/utils/enum';
import { BlogDto } from '../dto/BlogDto';
import { CategoryDto } from '../dto/CategoryDto';
import { DailyPathDto } from '../dto/DailyPathDto';
import { FeaturedTourDto } from '../dto/FeaturedTourDto';
import { StaticPageDto } from '../dto/StaticPageDto';
import { CreateContactFormDto } from '../dto/CreateContactFormDto';
import { FAQsDto } from '../dto/FAQsDto';
import { SliderDto } from '../dto/SliderDto';
import { CatalogDto } from '../dto/CatalogDto';
import { TravelCalendarDto } from '../dto/TravelCalendarDto';

export interface IHomepageService {
  getFeaturedTours(): Promise<FeaturedTourDto[]>;
  getCategories(): Promise<CategoryDto[]>;
  getTopTours(): Promise<FeaturedTourDto[]>;
  getBlogs(): Promise<BlogDto[]>;
  getDailyPaths(): Promise<DailyPathDto[]>;
  getStaticPage(pageType: StaticPageType): Promise<StaticPageDto>;
  createContactForm(contactFormDto: CreateContactFormDto): Promise<boolean>;
  getFAQs(): Promise<FAQsDto[]>;
  getHomepageSliders(): Promise<SliderDto[]>;
  getCatalogs(): Promise<CatalogDto[]>;
  getTravelCalendar(): Promise<TravelCalendarDto>;
}
