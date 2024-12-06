import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { inject, injectable } from 'inversify';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { InternalServerErrorException } from 'shared/errors/allException';
import { IBlogCategoryRepository } from '../interfaces/IBlogCategoryRepository';

@injectable()
export class BlogCategoryRepository implements IBlogCategoryRepository {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork) {}

  public async getAll(): Promise<BlogCategory[] | void> {
    try {
      const repo = await this.unitOfWork.getRepository(BlogCategory);
      const blogCategories = await repo.find({ relations: ['parent', 'primaryImages'] });
      if (blogCategories) return blogCategories as BlogCategory[];
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  public async getById(id: number): Promise<BlogCategory | void> {
    try {
      const repo = await this.unitOfWork.getRepository(BlogCategory);
      const blogCategory = await repo.findOne({
        where: { id: id },
        relations: ['parent', 'subCategories', 'primaryImages'],
      });
      if (blogCategory) return blogCategory as BlogCategory;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }
  public async getBySeoLink(seoLink: string): Promise<BlogCategory | void> {
    try {
      const repo = await this.unitOfWork.getRepository(BlogCategory);
      const blogCategory = await repo.findOne({
        where: { seoLink: seoLink },
        relations: ['parent', 'subCategories', 'primaryImages'],
      });
      if (blogCategory) return blogCategory as BlogCategory;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }
  public async getByName(name: string): Promise<BlogCategory | void> {
    try {
      const repo = await this.unitOfWork.getRepository(BlogCategory);
      const blogCategory = await repo.findOne({ where: { name: name }, relations: ['parent', 'subCategories'] });
      if (blogCategory) return blogCategory as BlogCategory;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }
  public async create(newBlogCategory: BlogCategory): Promise<BlogCategory> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(BlogCategory)).save(newBlogCategory);
      await this.unitOfWork.commitTransaction();
      return newBlogCategory;
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }

  public async update(id: number, blogCategory: BlogCategory): Promise<BlogCategory> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(BlogCategory)).save({ id, ...blogCategory });
      await this.unitOfWork.commitTransaction();
      return blogCategory;
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }
  public async delete(id: number): Promise<void> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(BlogCategory)).delete(id);
      await this.unitOfWork.commitTransaction();
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }
}
