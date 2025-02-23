import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { Catalog } from 'orm/entities/catalog/Catalog';
import { TourDailyPath } from 'orm/entities/tour/TourDailyPath';
import { PublishStatus } from 'shared/utils/enum';
import { DataSource } from 'typeorm';

const seedCatalogs = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Catalog);

  let catalog = new Catalog();
  catalog.order = 1;
  catalog.originalName = 'Çalışma';
  catalog.publicId = 'dev/catalog/2025-02-23/file_jidfkk';
  catalog.url = 'http://res.cloudinary.com/furkannn/image/upload/v1740340079/dev/catalog/2025-02-23/file_jidfkk.pdf';
  catalog.secureUrl =
    'https://res.cloudinary.com/furkannn/image/upload/v1740340079/dev/catalog/2025-02-23/file_jidfkk.pdf';
  catalog.format = 'pdf';
  catalog.width = 442;
  catalog.height = 612;
  catalog.pages = 20;
  catalog.bytes = 2869889;
  catalog.seoLink = 'calisma';
  catalog.publishStatus = PublishStatus.PUBLISH;
  catalog.insertUserId = 1;
  await repo.save(catalog);

  console.log('All catalogs have been seeded!');
};

export default seedCatalogs;
