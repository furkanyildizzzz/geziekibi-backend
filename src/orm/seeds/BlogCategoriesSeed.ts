import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { TourDailyPath } from 'orm/entities/tour/TourDailyPath';
import { DataSource } from 'typeorm';

const seedBlogCategories = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(BlogCategory);

  let category = new BlogCategory();
  category.name = 'Türkiye';
  category.seoLink = 'turkiye';
  category.insertUserId = 1;
  await repo.save(category);

  let subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Akdeniz';
  subCategory.seoLink = 'akdeniz';
  subCategory.insertUserId = 1;
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Doğu Anadolu';
  subCategory.seoLink = 'dogu-anadolu';
  subCategory.insertUserId = 1;
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Ege';
  subCategory.seoLink = 'ege';
  subCategory.insertUserId = 1;
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Güney Doğu Anadolu';
  subCategory.seoLink = 'guney-dogu-anadolu';
  subCategory.insertUserId = 1;
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'İç Anadolu';
  subCategory.seoLink = 'ic-anadolu';
  subCategory.insertUserId = 1;
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Karadeniz';
  subCategory.seoLink = 'karadeniz';
  subCategory.insertUserId = 1;
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Marmara';
  subCategory.seoLink = 'marmara';
  subCategory.insertUserId = 1;
  await repo.save(subCategory);

  category = new BlogCategory();
  category.name = 'Dünya';
  category.seoLink = 'dunya';
  category.insertUserId = 1;
  await repo.save(category);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Avrupa';
  subCategory.seoLink = 'avrupa';
  subCategory.insertUserId = 1;
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Asya';
  subCategory.seoLink = 'asya';
  subCategory.insertUserId = 1;
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Amerika';
  subCategory.seoLink = 'amerika';
  subCategory.insertUserId = 1;
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Afrika';
  subCategory.seoLink = 'afrika';
  subCategory.insertUserId = 1;
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Avustralya';
  subCategory.seoLink = 'avustralya';
  subCategory.insertUserId = 1;
  await repo.save(subCategory);

  category = new BlogCategory();
  category.name = 'Rehberler';
  category.seoLink = 'rehberler';
  category.insertUserId = 1;
  await repo.save(category);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Gezilecek Yerler';
  subCategory.seoLink = 'gezilecek-yerler';
  subCategory.insertUserId = 1;
  await repo.save(subCategory);

  category = new BlogCategory();
  category.name = 'Eğlence';
  category.seoLink = 'eglence';
  category.insertUserId = 1;
  await repo.save(category);

  category = new BlogCategory();
  category.name = 'Keşfet';
  category.seoLink = 'kesfet';
  category.insertUserId = 1;
  await repo.save(category);

  category = new BlogCategory();
  category.name = 'Yeme & İçme';
  category.seoLink = 'yeme-icme';
  category.insertUserId = 1;
  await repo.save(category);

  console.log('All blog categories have been seeded!');
};

export default seedBlogCategories;
