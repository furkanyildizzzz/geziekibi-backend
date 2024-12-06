import { inject, injectable } from 'inversify';
import { IBlogService } from '../interfaces/IBlogService';
import { INTERFACE_TYPE } from 'core/types';
import { IBlogRepository } from '../interfaces/IBlogRepository';
import { CreateBlogDto } from '../dto/CreateBlogDto';
import { BlogListDto } from '../dto/BlogListDto';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, InternalServerErrorException, NotFoundException } from 'shared/errors/allException';
import { BlogDto } from '../dto/BlogDto';
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

@injectable()
export class BlogService implements IBlogService {
  constructor(
    @inject(INTERFACE_TYPE.IBlogRepository) private readonly repository: IBlogRepository,
    @inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork,
    @inject(INTERFACE_TYPE.ISeoLinkService) private readonly seoLinkService: ISeoLinkService,
  ) {}

  public async getAll(): Promise<BlogListDto[]> {
    const blogs = await this.repository.getAll();
    if (blogs && blogs.length)
      return plainToInstance(BlogListDto, blogs, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    return [];
  }

  public async getById(id: string): Promise<BlogDto> {
    const blog = await this.repository.getById(Number(id));
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

  public async createBlog(blogData: CreateBlogDto): Promise<BlogDto> {
    const categoryRepository = await this.unitOfWork.getRepository(BlogCategory);
    const tagRepository = await this.unitOfWork.getRepository(Tag);
    const ImageRepository = await this.unitOfWork.getRepository(Image);

    const category = await categoryRepository.findOne({ where: { id: blogData.category.id } });
    if (!category) throw new NotFoundException(`Blog Category with id:${blogData.category.id} not found`);

    const tags = (await tagRepository.find()) as Tag[];
    if (blogData.tags && blogData.tags.length > 0) {
      const tagIds = blogData.tags.map((s) => s.id);
      if (!tags || !(tags.filter((t) => tagIds.includes(t.id)).length === tagIds.length))
        throw new NotFoundException(`One or more tags not found`);
    }

    if (!blogData.primaryImages.length) {
      throw new BadRequestException(`Please provide a primary image`);
    }

    try {
      const blog = new Blog();
      blog.title = blogData.title;
      blog.spot = blogData.spot;
      blog.body = blogData.body;
      blog.language = blogData.language;
      blog.publishStatus = blogData.publishStatus;
      blog.publishDate = new Date(blogData.publishDate);
      blog.seoLink = await this.seoLinkService.generateUniqueSeoLink(blogData.title, 'blog', blog.id);

      blog.category = category;

      const tagIds = blogData.tags.map((s) => s.id);
      blog.tags = tags.filter((t) => tagIds.includes(t.id));

      await this.repository.save(blog);

      //#region Images
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(now.getDate()).padStart(2, '0');
      // const hour = String(now.getHours()).padStart(2, '0');
      // const minute = String(now.getMinutes()).padStart(2, '0');

      const folderDate = `${year}-${month}-${day}`; //_${hour}-${minute};

      if (blogData.primaryImages && blogData.primaryImages.length) {
        const primaryImages: Image[] = [];
        const imageStr = 'data:image/jpeg;base64,' + blogData.primaryImages[0].buffer.toString('base64');
        await v2.uploader
          .upload(imageStr, { folder: `${process.env.NODE_ENV}/blog/${folderDate}/${blog.id}` })
          .then(async (result) => {
            const newImage = new Image();
            newImage.originalName = blogData.primaryImages[0].originalname;
            newImage.publicId = result.public_id;
            newImage.url = result.url;
            newImage.secureUrl = result.secure_url;
            newImage.format = result.format;
            newImage.width = result.width;
            newImage.height = result.height;
            newImage.createdAt = new Date(result.created_at);
            newImage.blog = blog;
            await ImageRepository.save(newImage);
            primaryImages.push(newImage);

            console.log({ imageUrl: result.url });
          })
          .catch((err) => {
            throw new InternalServerErrorException(
              `Something went wrong while uploading ${blogData.primaryImages[0].originalname} to cloudinary`,
            );
          });
      }

      return plainToInstance(BlogDto, blog, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async updateBlog(id: string, blogData: CreateBlogDto): Promise<BlogDto> {
    const categoryRepository = await this.unitOfWork.getRepository(BlogCategory);
    const tagRepository = await this.unitOfWork.getRepository(Tag);
    const ImageRepository = await this.unitOfWork.getRepository(Image);

    const blog = await this.repository.getById(Number(id));
    if (!blog) throw new NotFoundException(`Blog with id:${id} not found`);

    const category = await categoryRepository.findOne({ where: { id: blogData.category.id } });
    if (!category) throw new NotFoundException(`Blog Category with id:${blogData.category.id} not found`);

    const tags = (await tagRepository.find()) as Tag[];
    if (blogData.tags && blogData.tags.length > 0) {
      const tagIds = blogData.tags.map((s) => s.id);
      if (!tags || !(tags.filter((t) => tagIds.includes(t.id)).length === tagIds.length))
        throw new NotFoundException(`One or more tags not found`);
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

      const tagIds = blogData.tags.map((s) => s.id);
      blog.tags = tags.filter((t) => tagIds.includes(t.id));

      // Update the Blog entity in the database.
      await this.repository.update(Number(id), blog);

      //#region Images
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(now.getDate()).padStart(2, '0');
      // const hour = String(now.getHours()).padStart(2, '0');
      // const minute = String(now.getMinutes()).padStart(2, '0');

      const folderDate = `${year}-${month}-${day}`; //_${hour}-${minute};

      if (blogData.primaryImages && blogData.primaryImages.length) {
        const databaseImages = await ImageRepository.find({ where: { blog: { id: blog.id } } });
        const uploadedImagesIds = blogData.uploadedPrimaryImages.map((s) => s.id);
        const ImageIdsWillBeDeleted = databaseImages.filter((s) => !uploadedImagesIds.includes(s.id)).map((s) => s.id);

        if (ImageIdsWillBeDeleted.length) await ImageRepository.delete(ImageIdsWillBeDeleted);

        const primaryImages: Image[] = [];
        const imageStr = 'data:image/jpeg;base64,' + blogData.primaryImages[0].buffer.toString('base64');
        await v2.uploader
          .upload(imageStr, { folder: `${process.env.NODE_ENV}/blog/${folderDate}/${id}` })
          .then(async (result) => {
            const newImage = new Image();
            newImage.originalName = blogData.primaryImages[0].originalname;
            newImage.publicId = result.public_id;
            newImage.url = result.url;
            newImage.secureUrl = result.secure_url;
            newImage.format = result.format;
            newImage.width = result.width;
            newImage.height = result.height;
            newImage.createdAt = new Date(result.created_at);
            newImage.blog = blog;
            await ImageRepository.save(newImage);
            primaryImages.push(newImage);

            console.log({ imageUrl: result.url });
          })
          .catch((err) => {
            throw new InternalServerErrorException(
              `Something went wrong while uploading ${blogData.primaryImages[0].originalname} to cloudinary`,
            );
          });
      }

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
      const imageStr = 'data:image/jpeg;base64,' + file.buffer.toString('base64');
      return await v2.uploader
        .upload(imageStr, { folder: `${process.env.NODE_ENV}/blogBodyImage/` })
        .then((result) => {
          const imageUrl = result.url;
          console.log({ imageUrl });
          return imageUrl;
        })
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err.message);
        });
    } else {
      throw new BadRequestException('No file provided');
    }
  }
}
