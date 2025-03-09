import { Blog } from 'orm/entities/blog/Blog';

export interface IBlogRepositoryWeb {
  getAll(): Promise<Blog[] | void>;
  getById(id: number): Promise<Blog | void>;
  getBySeoLink(seoLink: string): Promise<Blog | void>;
}
