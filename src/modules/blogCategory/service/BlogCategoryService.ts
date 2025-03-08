import { inject, injectable } from 'inversify';
import { INTERFACE_TYPE } from 'core/types';
import { CreateBlogCategoryDto } from '../dto/CreateBlogCategoryDto';
import { BlogCategorySuccessDto } from '../dto/BlogCategorySuccessDto';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, InternalServerErrorException, NotFoundException } from 'shared/errors/allException';
import { Image } from 'orm/entities/image/Image';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { v2 } from 'cloudinary';
import { IBlogCategoryService } from '../interfaces/IBlogCategoryService';
import { IBlogCategoryRepository } from '../interfaces/IBlogCategoryRepository';
import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { ISeoLinkService } from 'shared/interfaces/ISeoLinkService';
import { IImageService } from 'shared/interfaces/IImageService';

@injectable()
export class BlogCategoryService implements IBlogCategoryService {
  constructor(
    @inject(INTERFACE_TYPE.IBlogCategoryRepository) private readonly repository: IBlogCategoryRepository,
    @inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork,
    @inject(INTERFACE_TYPE.ISeoLinkService) private readonly seoLinkService: ISeoLinkService,
    @inject(INTERFACE_TYPE.IImageService) private readonly imageService: IImageService,

  ) { }

  public async getAll(): Promise<BlogCategorySuccessDto[]> {
    const tourCategories = await this.repository.getAll(['parent', 'primaryImages']);
    if (tourCategories && tourCategories.length)
      return plainToInstance(BlogCategorySuccessDto, tourCategories, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    return [];
  }

  public async getById(id: string): Promise<BlogCategorySuccessDto> {
    const blogCategory = await this.repository.getById(Number(id),['parent', 'primaryImages']);
    if (!blogCategory) throw new NotFoundException(`Blog Category with id:${id} not found`);
    return plainToInstance(BlogCategorySuccessDto, blogCategory, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async getBySeoLink(seoLink: string): Promise<BlogCategorySuccessDto> {
    const blogCategory = await this.repository.getBySeoLink(seoLink);
    if (!blogCategory) throw new NotFoundException(`Blog Category with seoLink:${seoLink} not found`);
    return plainToInstance(BlogCategorySuccessDto, blogCategory, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async createBlogCategory(blogCategoryData: CreateBlogCategoryDto): Promise<BlogCategorySuccessDto> {
    try {
      let newBlogCategory = new BlogCategory();
      const blogCategory = await this.repository.getByName(blogCategoryData.name);
      if (blogCategory) throw new BadRequestException(`Blog Category '${blogCategoryData.name}' is already exists`);
      newBlogCategory.name = blogCategoryData.name;
      newBlogCategory.seoLink = await this.seoLinkService.generateUniqueSeoLink(
        blogCategoryData.name,
        'blogCategory',
        newBlogCategory.id,
      );

      if (blogCategoryData.parentId > 0) {
        const parentBlogCategory = await this.repository.getById(blogCategoryData.parentId);
        if (!parentBlogCategory)
          throw new NotFoundException(`Parent Blog Category with id:${blogCategoryData.parentId} not found`);
        newBlogCategory.parent = parentBlogCategory;
      }

      if (!blogCategoryData.primaryImages.length) {
        throw new BadRequestException(`Please provide a primary image`);
      }

      newBlogCategory.description = blogCategoryData.description;
      // await this.repository.create(newBlogCategory);

      newBlogCategory = await this.repository.create(newBlogCategory);
      //#region Images

      const primaryImages = await this.imageService.saveImages(
        'blogCategory',
        newBlogCategory.id,
        blogCategoryData.primaryImages,
        [],
        'blogCategory'
      );

      newBlogCategory.primaryImages = primaryImages

      return plainToInstance(BlogCategorySuccessDto, newBlogCategory, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }
  public async updateBlogCategory(
    id: string,
    blogCategoryData: CreateBlogCategoryDto,
  ): Promise<BlogCategorySuccessDto> {
    try {
      const blogCategory = await this.repository.getById(Number(id));
      if (!blogCategory) throw new NotFoundException(`Blog Category with id:'${id}' is not found`);

      if (blogCategory.name !== blogCategoryData.name) {
        const blogCategoryByName = await this.repository.getByName(blogCategoryData.name);
        if (blogCategoryByName)
          throw new BadRequestException(`Blog Category '${blogCategoryData.name}' is already exists`);
      }
      blogCategory.name = blogCategoryData.name;
      blogCategory.seoLink = await this.seoLinkService.generateUniqueSeoLink(
        blogCategoryData.name,
        'blogCategory',
        blogCategory.id,
      );

      if (blogCategoryData.parentId) {
        const parentBlogCategory = await this.repository.getById(blogCategoryData.parentId);
        if (!parentBlogCategory)
          throw new NotFoundException(`Parent Blog Category with id:${blogCategoryData.parentId} not found`);
        blogCategory.parent = parentBlogCategory;
      } else {
        blogCategory.parent = null;
      }

      if (!blogCategoryData.uploadedPrimaryImages.length && !blogCategoryData.primaryImages.length) {
        throw new BadRequestException(`Please provide a primary image`);
      }
      blogCategory.description = blogCategoryData.description;

      await this.repository.save(Number(id), blogCategory);
      //#region Images
      const primaryImages = await this.imageService.saveImages(
        'blogCategory',
        blogCategory.id,
        blogCategoryData.primaryImages,
        blogCategoryData.uploadedPrimaryImages.map(s => s.id),
        'blogCategory'
      );

      blogCategory.primaryImages = primaryImages

      return plainToInstance(BlogCategorySuccessDto, blogCategory, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }
  public async deleteBlogCategory(id: string): Promise<void> {
    const blogCategory = await this.repository.getById(Number(id));
    if (!blogCategory) throw new NotFoundException(`Blog Category with id:'${id}' is not found`);
    await this.repository.delete(Number(id));
  }
}
