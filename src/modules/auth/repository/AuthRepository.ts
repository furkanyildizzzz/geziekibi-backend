import { inject, injectable } from 'inversify';
import { IAuthRepository } from '../interfaces/IAuthRepository';
import { User } from 'orm/entities/users/User';
import { INTERFACE_TYPE } from 'core/types';
import { InternalServerErrorException } from 'shared/errors/allException';
import { UnitOfWork } from 'unitOfWork/unitOfWork';

@injectable()
export class AuthRepository implements IAuthRepository {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork) {}

  async save(newUser: User): Promise<User | void> {
    try {
      const repo = await this.unitOfWork.getRepository(User);
      const user = await repo.save(newUser);
      if (user) return user as User;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  async getByEmail(email: string): Promise<User | void> {
    try {
      const repo = await this.unitOfWork.getRepository(User);
      const user = await repo.findOne({ where: { email } });
      if (user) return user as User;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }
  getById(id: number): Promise<User | void> {
    throw new Error('Method not implemented.');
  }
}
