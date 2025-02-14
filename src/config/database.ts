import { Blog } from 'orm/entities/blog/Blog';
import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { Catalog } from 'orm/entities/catalog/Catalog';
import { ContactForm } from 'orm/entities/contactForm/ContactForm';
import { FAQ } from 'orm/entities/faq/FAQ';
import { HomepageSlider } from 'orm/entities/homepageSlider/HomepageSlider';
import { Image } from 'orm/entities/image/Image';
import { Service } from 'orm/entities/service/Service';
import { StaticPage } from 'orm/entities/static-page/StaticPage';
import { Tag } from 'orm/entities/tag/Tag';
import { Tour } from 'orm/entities/tour/Tour';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { TourDaily } from 'orm/entities/tour/TourDaily';
import { TourDailyPath } from 'orm/entities/tour/TourDailyPath';
import { TourDailyVisitingPlace } from 'orm/entities/tour/TourDailyVisitingPlace';
import { TourDate } from 'orm/entities/tour/TourDate';
import { TourPrice } from 'orm/entities/tour/TourPrice';
import TourService from 'orm/entities/tour/TourService';
import { User } from 'orm/entities/users/User';
import { UserAddress } from 'orm/entities/users/UserAddress';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const AppDataSource = new DataSource({
  type: 'postgres',
  name: 'default',
  url: `${process.env.PG_URL}`,
  // host: `${process.env.PG_HOST}`,
  // port: Number(`${process.env.PG_PORT}`),
  // username: `${process.env.POSTGRES_USER}`,
  // password: `${process.env.POSTGRES_PASSWORD}`,
  // database: `${process.env.POSTGRES_DB}`,
  synchronize: false,
  logging: false,
  //entities: ['src/orm/entities/**/*.{ts,js}'],
  entities: [
    Blog,
    BlogCategory,
    Catalog,
    ContactForm,
    FAQ,
    HomepageSlider,
    Image,
    Service,
    StaticPage,
    Tag,
    Tour,
    TourCategory,
    TourDaily,
    TourDailyPath,
    TourDailyVisitingPlace,
    TourDate,
    TourPrice,
    TourService,
    User,
    UserAddress,
  ],
  //migrations: ['src/orm/migrations/**/*.{ts,js}'],
  //subscribers: ['src/orm/subscriber/**/*.{ts,js}'],
  namingStrategy: new SnakeNamingStrategy(),
});

export const initializeDatabase = async () => {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log('Database connection established successfully.');
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }
};

export default AppDataSource;
