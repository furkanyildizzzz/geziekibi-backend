import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { IBaseRepository } from 'shared/interfaces/IBaseRepository';

export interface IBlogCategoryRepository extends IBaseRepository<BlogCategory> {
  getByName(name: string): Promise<BlogCategory | void>;
  getBySeoLink(seoLink: string): Promise<BlogCategory | void>;
}
