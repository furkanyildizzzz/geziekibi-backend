import { BlogDtoWeb } from '../dto/BlogDtoWeb';
import { BlogListDtoWeb } from '../dto/BlogListDtoWeb';

export interface IBlogServiceWeb {
  getAll(): Promise<BlogListDtoWeb[]>;
  getBySeoLink(seoLink: string): Promise<BlogDtoWeb>;
}
