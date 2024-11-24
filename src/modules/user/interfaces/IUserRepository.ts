import { User } from 'orm/entities/users/User';

export interface IUserRepository {
  getAll(): Promise<User[] | void>;
  getById(id: number): Promise<User | void>;
  save(user: User): Promise<User>;
  update(id: number, tour: User): Promise<User>;
  delete(id: number): Promise<void>;
}
