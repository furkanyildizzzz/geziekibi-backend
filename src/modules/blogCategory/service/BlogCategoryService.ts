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

@injectable()
export class BlogCategoryService implements IBlogCategoryService {
  constructor(
    @inject(INTERFACE_TYPE.IBlogCategoryRepository) private readonly repository: IBlogCategoryRepository,
    @inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork,
    @inject(INTERFACE_TYPE.ISeoLinkService) private readonly seoLinkService: ISeoLinkService,
  ) {}

  public async getAll(): Promise<BlogCategorySuccessDto[]> {
    const tourCategories = await this.repository.getAll();
    if (tourCategories && tourCategories.length)
      return plainToInstance(BlogCategorySuccessDto, tourCategories, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    return [];
  }

  public async getById(id: string): Promise<BlogCategorySuccessDto> {
    const blogCategory = await this.repository.getById(Number(id));
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
    console.log({ parentId: blogCategoryData.parentId });
    const newBlogCategory = new BlogCategory();
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

    newBlogCategory.description = blogCategoryData.description;
    await this.repository.create(newBlogCategory);
    return plainToInstance(BlogCategorySuccessDto, blogCategory, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
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

      await this.repository.update(Number(id), blogCategory);

      //#region Images
      const ImageRepository = await this.unitOfWork.getRepository(Image);
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(now.getDate()).padStart(2, '0');
      // const hour = String(now.getHours()).padStart(2, '0');
      // const minute = String(now.getMinutes()).padStart(2, '0');

      const folderDate = `${year}-${month}-${day}`; //_${hour}-${minute};

      if (blogCategoryData.primaryImages && blogCategoryData.primaryImages.length) {
        const databaseImages = await ImageRepository.find({ where: { category: { id: blogCategory.id } } });
        console.log({ databaseImages });
        const uploadedImagesIds = blogCategoryData.uploadedPrimaryImages.map((s) => s.id);
        console.log({ uploadedImagesIds });
        const ImageIdsWillBeDeleted = databaseImages.filter((s) => !uploadedImagesIds.includes(s.id)).map((s) => s.id);
        console.log({ ImageIdsWillBeDeleted });
        if (ImageIdsWillBeDeleted.length) await ImageRepository.delete(ImageIdsWillBeDeleted);

        const primaryImages: Image[] = [];
        const imageStr = 'data:image/jpeg;base64,' + blogCategoryData.primaryImages[0].buffer.toString('base64');
        await v2.uploader
          .upload(imageStr, { folder: `${process.env.NODE_ENV}/category/${folderDate}/${id}` })
          .then(async (result) => {
            const newImage = new Image();
            newImage.originalName = blogCategoryData.primaryImages[0].originalname;
            newImage.publicId = result.public_id;
            newImage.url = result.url;
            newImage.secureUrl = result.secure_url;
            newImage.format = result.format;
            newImage.width = result.width;
            newImage.height = result.height;
            newImage.createdAt = new Date(result.created_at);
            newImage.blogCategory = blogCategory;
            await ImageRepository.save(newImage);
            primaryImages.push(newImage);

            console.log({ imageUrl: result.url });
          })
          .catch((err) => {
            throw new InternalServerErrorException(
              `Something went wrong while uploading ${blogCategoryData.primaryImages[0].originalname} to cloudinary`,
            );
          });
      }

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
