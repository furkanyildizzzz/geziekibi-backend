import { inject, injectable } from 'inversify';
import { IBlogRepository } from '../interfaces/IBlogRepository';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { Blog } from 'orm/entities/blog/Blog';
import { InternalServerErrorException } from 'shared/errors/allException';
import { BaseRepository } from 'shared/repositories/BaseRepository';

@injectable()
export class BlogRepository extends BaseRepository<Blog>
  implements IBlogRepository {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) unitOfWork: UnitOfWork) {
    super(unitOfWork, Blog)
  }

  async getBySeoLink(seoLink: string): Promise<Blog | null> {
    return this.findOneByField("seoLink", seoLink);
  }

  // public async save(newBlog: Blog): Promise<Blog> {
  //   try {
  //     await this.unitOfWork.startTransaction();
  //     await this.create(newBlog);
  //     await this.unitOfWork.commitTransaction();
  //     return newBlog;
  //   } catch (error) {
  //     await this.unitOfWork.rollbackTransaction();
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
  // public async update(id: number, blog: Blog): Promise<Blog> {
  //   try {
  //     await this.unitOfWork.startTransaction();
  //     await this.update(id, blog);
  //     await this.unitOfWork.commitTransaction();
  //     return blog;
  //   } catch (error) {
  //     await this.unitOfWork.rollbackTransaction();
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
  // public async delete(id: number): Promise<void> {
  //   try {
  //     await this.unitOfWork.startTransaction();
  //     await this.delete(id);
  //     await this.unitOfWork.commitTransaction();
  //   } catch (error) {
  //     await this.unitOfWork.rollbackTransaction();
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
}
