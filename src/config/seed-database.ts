import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const AppDataSource = new DataSource({
  type: 'postgres',
  name: 'default',
  host: 'localhost',
  port: Number(process.env.PG_PORT),
  username: 'postgres',
  password: 'postgres',
  database: 'geziekibi',
  synchronize: false,
  logging: false,
  entities: ['src/orm/entities/**/*.ts'],
  migrations: ['src/orm/seeds/**/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
});

export = AppDataSource;
