import { Blog } from 'orm/entities/blog/Blog';
import { IBaseRepository } from 'shared/interfaces/IBaseRepository';

export interface IBlogRepository extends IBaseRepository<Blog> {
  getBySeoLink(seoLink: string): Promise<Blog | void>;
}
