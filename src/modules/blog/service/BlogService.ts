import { inject, injectable } from 'inversify';
import { IBlogService } from '../interfaces/IBlogService';
import { INTERFACE_TYPE } from 'core/types';
import { IBlogRepository } from '../interfaces/IBlogRepository';
import { CreateBlogDto } from '../dto/CreateBlogDto';
import { BlogListDto } from '../dto/BlogListDto';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, InternalServerErrorException, NotFoundException } from 'shared/errors/allException';
import { BlogDto } from '../dto/BlogDto';
import { ITagRepository } from 'modules/tag/interfaces/ITagRepository';
import { IServiceRepository } from 'modules/service/interfaces/IServiceRepository';
import { Tag } from 'orm/entities/tag/Tag';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { v2 } from 'cloudinary';
import { Image } from 'orm/entities/image/Image';
import { Blog } from 'orm/entities/blog/Blog';
import { ISeoLinkService } from 'shared/interfaces/ISeoLinkService';
import { IBlogCategoryRepository } from 'modules/blogCategory/interfaces/IBlogCategoryRepository';
import { IImageService } from 'shared/interfaces/IImageService';
import { Transactional } from 'shared/decorators/Transactional';

@injectable()
export class BlogService implements IBlogService {
  constructor(
    @inject(INTERFACE_TYPE.IBlogRepository) private readonly repository: IBlogRepository,
    @inject(INTERFACE_TYPE.IBlogCategoryRepository) private readonly categoryRepository: IBlogCategoryRepository,
    @inject(INTERFACE_TYPE.ITagRepository) private readonly tagRepository: ITagRepository,
    @inject(INTERFACE_TYPE.IImageService) private readonly imageService: IImageService,
    @inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork,
    @inject(INTERFACE_TYPE.ISeoLinkService) private readonly seoLinkService: ISeoLinkService,
  ) { }

  public async getAll(): Promise<BlogListDto[]> {
    const blogs = await this.repository.getAll(['tags', 'category', 'primaryImages']);
    if (blogs && blogs.length)
      return plainToInstance(BlogListDto, blogs, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    return [];
  }

  public async getById(id: string): Promise<BlogDto> {
    const blog = await this.repository.getById(Number(id), ['tags', 'category', 'primaryImages']);
    if (!blog) throw new NotFoundException(`Blog with id:${id} not found`);
    return plainToInstance(BlogDto, blog, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async getBySeoLink(seoLink: string): Promise<BlogDto> {
    const blog = await this.repository.getBySeoLink(seoLink);
    if (!blog) throw new NotFoundException(`Blog with seoLink:${seoLink} not found`);
    return plainToInstance(BlogDto, blog, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  @Transactional()
  public async createBlog(blogData: CreateBlogDto): Promise<BlogDto> {

    const category = await this.categoryRepository.getById(blogData.category.id);
    if (!category) throw new NotFoundException(`Blog Category with id:${blogData.category.id} not found`);

    let tags: Tag[] | undefined;

    if (blogData.tags && Array.isArray(blogData.tags) && blogData.tags.length > 0) {
      tags = await this.tagRepository.findByIds(blogData.tags.map((t) => t.id));

      if (tags.length !== blogData.tags.length) {
        throw new NotFoundException("One or more tags not found");
      }
    }

    if (!blogData.primaryImages.length) {
      throw new BadRequestException(`Please provide a primary image`);
    }

    try {
      let blog = new Blog();
      blog.title = blogData.title;
      blog.spot = blogData.spot;
      blog.body = blogData.body;
      blog.language = blogData.language;
      blog.publishStatus = blogData.publishStatus;
      blog.publishDate = new Date(blogData.publishDate);
      blog.seoLink = await this.seoLinkService.generateUniqueSeoLink(blogData.title, 'blog', blog.id);

      blog.category = category;
      blog.tags = tags;

      blog = await this.repository.create(blog);
      //#region Images

      const primaryImages = await this.imageService.saveImages(
        'blog',
        blog.id,
        blogData.primaryImages,
        [],
        'blog'
      );

      blog.primaryImages = primaryImages

      return plainToInstance(BlogDto, blog, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  @Transactional()
  public async updateBlog(id: string, blogData: CreateBlogDto): Promise<BlogDto> {
    const blog = await this.repository.getById(Number(id));
    if (!blog) throw new NotFoundException(`Blog with id:${id} not found`);

    const category = await this.categoryRepository.getById(blogData.category.id);
    if (!category) throw new NotFoundException(`Blog Category with id:${blogData.category.id} not found`);

    let tags: Tag[] | undefined;
    if (blogData.tags && Array.isArray(blogData.tags) && blogData.tags.length > 0) {
      tags = await this.tagRepository.findByIds(blogData.tags.map((t) => t.id));

      if (tags.length !== blogData.tags.length) {
        throw new NotFoundException("One or more tags not found");
      }
    }

    if (!blogData.uploadedPrimaryImages.length && !blogData.primaryImages.length) {
      throw new BadRequestException(`Please provide a primary image`);
    }

    try {
      blog.title = blogData.title;
      blog.spot = blogData.spot;
      blog.body = blogData.body;
      blog.language = blogData.language;
      blog.publishStatus = blogData.publishStatus;
      blog.publishDate = new Date(blogData.publishDate);
      blog.seoLink = await this.seoLinkService.generateUniqueSeoLink(blogData.title, 'blog', blog.id);

      blog.category = category;
      blog.tags = tags

      // Update the Blog entity in the database.
      await this.repository.save(Number(id), blog);

      //#region Images
      const primaryImages = await this.imageService.saveImages(
        'blog',
        blog.id,
        blogData.primaryImages,
        blogData.uploadedPrimaryImages.map(s => s.id),
        'blog'
      );

      blog.primaryImages = primaryImages

      return plainToInstance(BlogDto, blog, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async deleteBlog(id: string): Promise<void> {
    const blog = await this.repository.getById(Number(id));
    if (!blog) throw new NotFoundException(`Blog with id:'${id}' is not found`);
    await this.repository.delete(Number(id));
  }

  public async uploadBodyImage(file: Express.Multer.File): Promise<string> {
    if (file) {
      return await this.imageService.uploadBodyImage("blogBodyImage", file)
    } else {
      throw new BadRequestException('No file provided');
    }
  }
}
