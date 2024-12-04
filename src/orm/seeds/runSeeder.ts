import AppDataSource from 'config/migration-database';
import seedTourPaths from './TourPathSeed';
import seedUsers from './UsersSeed';
import seedBlogCategories from './BlogCategoriesSeed';
import seedTourCategories from './TourCategoriesSeed';
import seedTourServices from './TourServicesSeed';
import seedTags from './TagsSeed';
import seedTours from './ToursSeed';

const runSeeder = async () => {
  try {
    console.log('Connecting to database...');
    await AppDataSource.initialize();

    console.log('Seeding users...');
    await seedUsers(AppDataSource);

    console.log('Seeding blog categories...');
    await seedBlogCategories(AppDataSource);

    console.log('Seeding tour categories...');
    await seedTourCategories(AppDataSource);

    console.log('Seeding tour services...');
    await seedTourServices(AppDataSource);

    console.log('Seeding tour paths...');
    await seedTourPaths(AppDataSource);

    console.log('Seeding tags ...');
    await seedTags(AppDataSource);

    console.log('Seeding tours ...');
    await seedTours(AppDataSource);

    console.log('Seeding completed!');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

runSeeder();
