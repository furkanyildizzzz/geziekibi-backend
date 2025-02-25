import { inject, injectable } from 'inversify';
import { IBlogRepository } from '../interfaces/IBlogRepository';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { Blog } from 'orm/entities/blog/Blog';
import { InternalServerErrorException } from 'shared/errors/allException';

@injectable()
export class BlogRepository implements IBlogRepository {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork) {}

  public async getAll(): Promise<Blog[] | void> {
    try {
      const repo = await this.unitOfWork.getRepository(Blog);
      const blogs = await repo.find({ relations: ['tags', 'category', 'primaryImages'] });
      return blogs;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  public async getById(id: number): Promise<Blog | void> {
    try {
      const repo = await this.unitOfWork.getRepository(Blog);
      const blog = await repo.findOne({
        where: { id: id },
        relations: ['tags', 'category', 'primaryImages'],
      });
      if (blog) return blog as Blog;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }
  public async getBySeoLink(seoLink: string): Promise<Blog | void> {
    try {
      const repo = await this.unitOfWork.getRepository(Blog);
      const blog = await repo.findOne({
        where: { seoLink: seoLink },
        relations: ['tags', 'category', 'primaryImages'],
      });
      if (blog) return blog as Blog;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }
  public async save(newBlog: Blog): Promise<Blog> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(Blog)).save(newBlog);
      await this.unitOfWork.commitTransaction();
      return newBlog;
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }
  public async update(id: number, blog: Blog): Promise<Blog> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(Blog)).save({ id, ...blog });
      await this.unitOfWork.commitTransaction();
      return blog;
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }
  public async delete(id: number): Promise<void> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(Blog)).delete(id);
      await this.unitOfWork.commitTransaction();
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }
}
