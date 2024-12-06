import { inject, injectable } from 'inversify';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from 'orm/entities/users/User';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { InternalServerErrorException } from 'shared/errors/allException';

@injectable()
export class UserRepository implements IUserRepository {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork) {}

  public async getAll(): Promise<User[] | void> {
    try {
      const repo = await this.unitOfWork.getRepository(User);
      const users = await repo.find({ relations: ['profileImage'] });
      return users;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  public async getById(id: number): Promise<User | void> {
    try {
      const repo = await this.unitOfWork.getRepository(User);
      const user = await repo.findOne({
        where: { id: id },
        relations: ['profileImage', 'address'],
      });
      if (user) return user as User;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }
  public async getBySeoLink(seoLink: string): Promise<User | void> {
    try {
      const repo = await this.unitOfWork.getRepository(User);
      const user = await repo.findOne({
        where: { seoLink: seoLink },
        relations: ['profileImage', 'address'],
      });
      if (user) return user as User;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }
  public async save(user: User): Promise<User> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(User)).save(user);
      await this.unitOfWork.commitTransaction();
      return user;
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }
  public async update(id: number, user: User): Promise<User> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(User)).save({ id, ...user });
      await this.unitOfWork.commitTransaction();
      return user;
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }
  public async delete(id: number): Promise<void> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(User)).delete(id);
      await this.unitOfWork.commitTransaction();
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }
}
