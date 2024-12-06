import { BlogCategorySuccessDto } from '../dto/BlogCategorySuccessDto';
import { CreateBlogCategoryDto } from '../dto/CreateBlogCategoryDto';

export interface IBlogCategoryService {
  getAll(): Promise<BlogCategorySuccessDto[]>;
  getById(id: string): Promise<BlogCategorySuccessDto>;
  getBySeoLink(seoLink: string): Promise<BlogCategorySuccessDto>;
  createBlogCategory(blogCategoryData: CreateBlogCategoryDto): Promise<BlogCategorySuccessDto>;
  updateBlogCategory(id: string, blogCategoryData: CreateBlogCategoryDto): Promise<BlogCategorySuccessDto>;
  deleteBlogCategory(id: string): Promise<void>;
}
