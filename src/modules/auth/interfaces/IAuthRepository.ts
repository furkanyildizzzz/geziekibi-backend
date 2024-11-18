import { User } from 'orm/entities/users/User';

export interface IAuthRepository {
  getByEmail(email: string): Promise<User | void>;
  getById(id: number): Promise<User | void>;
  save(user: User): Promise<User | void>;
}
