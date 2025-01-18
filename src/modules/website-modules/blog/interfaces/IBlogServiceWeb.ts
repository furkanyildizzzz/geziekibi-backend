import { BlogDtoWeb } from '../dto/BlogDtoWeb';
import { BlogListDtoWeb } from '../dto/BlogListDtoWeb';
import { CategoryDto } from '../dto/CategoryDto';

export interface IBlogServiceWeb {
  getAll(): Promise<BlogListDtoWeb[]>;
  getBySeoLink(seoLink: string): Promise<BlogDtoWeb>;
  getCategories(): Promise<CategoryDto[]>;
}
