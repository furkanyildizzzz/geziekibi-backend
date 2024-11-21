import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const AppDataSource = new DataSource({
  type: 'postgres',
  name: 'default',
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: false,
  entities: ['src/orm/entities/**/*.ts'],
  migrations: ['src/orm/migrations/**/*.ts'],
  subscribers: ['src/orm/subscriber/**/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
});

// const AppDataSource = new DataSource({
//   type: 'postgres',
//   name: 'default',
//   host: 'localhost',
//   port: Number(process.env.PG_PORT),
//   username: 'postgres',
//   password: 'postgres',
//   database: 'geziekibi',
//   synchronize: false,
//   logging: false,
//   entities: ['src/orm/entities/**/*.ts'],
//   migrations: ['src/orm/migrations/**/*.ts'],
//   subscribers: ['src/orm/subscriber/**/*.ts'],
//   namingStrategy: new SnakeNamingStrategy(),
// });

export = AppDataSource;