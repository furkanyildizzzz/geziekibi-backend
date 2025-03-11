import { inject, injectable } from 'inversify';
import { IBlogServiceWeb } from '../interfaces/IBlogServiceWeb';
import { INTERFACE_TYPE } from 'core/types';
import { IBlogRepositoryWeb } from '../interfaces/IBlogRepositoryWeb';
import { BlogListDtoWeb } from '../dto/BlogListDtoWeb';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, InternalServerErrorException, NotFoundException } from 'shared/errors/allException';
import { BlogDtoWeb } from '../dto/BlogDtoWeb';
import { IBlogCategoryRepository } from 'modules/blogCategory/interfaces/IBlogCategoryRepository';
import { ITagRepository } from 'modules/tag/interfaces/ITagRepository';
import { IServiceRepository } from 'modules/service/interfaces/IServiceRepository';
import { Tag } from 'orm/entities/tag/Tag';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { v2 } from 'cloudinary';
import { Image } from 'orm/entities/image/Image';
import { Blog } from 'orm/entities/blog/Blog';
import { ISeoLinkService } from 'shared/interfaces/ISeoLinkService';
import { CategoryDto } from '../dto/CategoryDto';

@injectable()
export class BlogServiceWeb implements IBlogServiceWeb {
  constructor(
    @inject(INTERFACE_TYPE.IBlogRepositoryWeb) private readonly repository: IBlogRepositoryWeb,
    @inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork,
    @inject(INTERFACE_TYPE.ISeoLinkService) private readonly seoLinkService: ISeoLinkService,
  ) {}

  public async getAll(): Promise<BlogListDtoWeb[]> {
    const blogs = await this.repository.getAll();
    if (blogs && blogs.length)
      return plainToInstance(BlogListDtoWeb, blogs, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    return [];
  }

  public async getBySeoLink(seoLink: string): Promise<BlogDtoWeb> {
    const blog = await this.repository.getBySeoLink(seoLink);
    if (!blog) throw new NotFoundException(`Blog with seoLink:${seoLink} not found`);
    return plainToInstance(BlogDtoWeb, blog, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async getCategories(): Promise<CategoryDto[]> {
    const categoryRepo = await this.unitOfWork.getRepository(BlogCategory);
    const categories = await categoryRepo.find({
      relations: ['parent', 'subCategories', 'primaryImages', 'blogs', 'subCategories.blogs'],
    });

    const calculateBlogCount = (category: BlogCategory): number => {
      // Count blogs in the current category
      let blogCount =
        category.blogs === undefined || category.blogs.length === 0
          ? 0
          : category.blogs.filter((blog) => blog.publishStatus === 'publish').length;

      // Add tour counts from subcategories
      if (category.subCategories && category.subCategories.length > 0) {
        blogCount += category.subCategories.reduce((count, subCategory) => count + calculateBlogCount(subCategory), 0);
      }

      return blogCount;
    };

    const parentCategoriesWithPublishedBlogCount = categories
      .map((category) => ({
        ...category,
        uploadedPrimaryImages: category.primaryImages,
        blogCount: calculateBlogCount(category), // Calculate total tour count recursively
      }))
      .filter((s) => s.parent === null);

    return plainToInstance(CategoryDto, parentCategoriesWithPublishedBlogCount, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }
}
