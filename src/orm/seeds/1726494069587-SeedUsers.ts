import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

import { Role } from '../entities/users/types';
import { User } from '../entities/users/User';

export class SeedUsers1590519635401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let user = new User();
    const userRepository = getRepository(User);

    user.firstName = 'Walter';
    user.lastName = 'White';
    user.email = 'admin@admin.com';
    user.password = 'pass1';
    user.hashPassword();
    user.role = 'ADMINISTRATOR' as Role;
    await userRepository.save(user);

    user = new User();
    user.firstName = 'Jesse';
    user.lastName = 'Pinkman';
    user.email = 'standard@standard.com';
    user.password = 'pass1';
    user.hashPassword();
    user.role = 'STANDARD' as Role;
    await userRepository.save(user);

    user = new User();
    user.firstName = 'Skyler';
    user.lastName = 'White';
    user.email = 'skyler.white@test.com';
    user.password = 'pass1';
    user.hashPassword();
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    console.log('Not implemented');
  }
}
