import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const AppDataSource = new DataSource({
  type: 'postgres',
  name: 'seed',
  host: `${process.env.PG_HOST}`,
  port: Number(`${process.env.PG_PORT}`),
  username: `${process.env.POSTGRES_USER}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  database: `${process.env.POSTGRES_DB}`,
  synchronize: false,
  logging: false,
  entities: ['src/orm/entities/**/*.ts'],
  migrations: ['src/orm/seeds/**/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
});

export = AppDataSource;
