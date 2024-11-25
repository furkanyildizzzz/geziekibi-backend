import AppDataSource from 'config/migration-database';
import seedTourPaths from './TourPathSeed';

const runSeeder = async () => {
  try {
    console.log('Connecting to database...');
    await AppDataSource.initialize();

    console.log('Seeding profile images...');
    await seedTourPaths(AppDataSource);

    console.log('Seeding completed!');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

runSeeder();
