import { CreateBlogDto } from '../dto/CreateBlogDto';
import { BlogDto } from '../dto/BlogDto';
import { BlogListDto } from '../dto/BlogListDto';

export interface IBlogService {
  getAll(): Promise<BlogListDto[]>;
  getById(id: string): Promise<BlogDto>;
  getBySeoLink(seoLink: string): Promise<BlogDto>;
  createBlog(tourData: CreateBlogDto): Promise<BlogDto>;
  updateBlog(id: string, tourData: CreateBlogDto): Promise<BlogDto>;
  deleteBlog(id: string): Promise<void>;
  uploadBodyImage(files: Express.Multer.File): Promise<string>;
}
