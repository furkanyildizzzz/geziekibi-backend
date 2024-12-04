import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { TourDailyPath } from 'orm/entities/tour/TourDailyPath';
import { DataSource } from 'typeorm';

const seedBlogCategories = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(BlogCategory);

  let category = new BlogCategory();
  category.name = 'Türkiye';
  await repo.save(category);

  let subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Akdeniz';
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Doğu Anadolu';
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Ege';
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Güney Doğu Anadolu';
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'İç Anadolu';
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Karadeniz';
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Marmara';
  await repo.save(subCategory);

  category = new BlogCategory();
  category.name = 'Dünya';
  await repo.save(category);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Avrupa';
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Asya';
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Amerika';
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Afrika';
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Avustralya';
  await repo.save(subCategory);

  category = new BlogCategory();
  category.name = 'Rehberler';
  await repo.save(category);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Gezilecek Yerler';
  await repo.save(subCategory);

  category = new BlogCategory();
  category.name = 'Eğlence';
  await repo.save(category);

  category = new BlogCategory();
  category.name = 'Keşfet';
  await repo.save(category);

  category = new BlogCategory();
  category.name = 'Yeme & İçme';
  await repo.save(category);

  console.log('All blog categories have been seeded!');
};

export default seedBlogCategories;
