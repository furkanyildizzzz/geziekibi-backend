import { Role } from 'orm/entities/users/types';
import { User } from 'orm/entities/users/User';
import { DataSource } from 'typeorm';

const seedUsers = async (dataSource: DataSource) => {
  let user = new User();
  const userRepository = dataSource.getRepository(User);

  user.firstName = 'Mustafa';
  user.lastName = 'Başak';
  user.email = 'mustafabasak@gmail.com';
  user.password = 'mustafabasak';
  user.hashPassword();
  user.role = 'ADMINISTRATOR' as Role;
  user.seoLink = 'mustafa-basak';
  await userRepository.save(user);

  user = new User();
  user.firstName = 'Furkan';
  user.lastName = 'Yıldız';
  user.email = 'admin@admin.com';
  user.password = 'test';
  user.hashPassword();
  user.role = 'ADMINISTRATOR' as Role;
  user.seoLink = 'admin';
  await userRepository.save(user);

  // user = new User();
  // user.firstName = 'Skyler';
  // user.lastName = 'White';
  // user.email = 'skyler.white@test.com';
  // user.password = 'test';
  // user.hashPassword();
  // user.seoLink = 'skyler-white';
  // await userRepository.save(user);

  console.log('All users have been seeded!');
};

export default seedUsers;
