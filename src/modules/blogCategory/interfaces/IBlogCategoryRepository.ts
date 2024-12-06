import { BlogCategory } from 'orm/entities/blog/BlogCategory';

export interface IBlogCategoryRepository {
  getAll(): Promise<BlogCategory[] | void>;
  getById(id: number): Promise<BlogCategory | void>;
  getByName(name: string): Promise<BlogCategory | void>;
  getBySeoLink(seoLink: string): Promise<BlogCategory | void>;
  create(newBlogCategory: BlogCategory): Promise<BlogCategory>;
  update(id: number, tag: BlogCategory): Promise<BlogCategory>;
  delete(id: number): Promise<void>;
}
