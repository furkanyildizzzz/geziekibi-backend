import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { TourDailyPath } from 'orm/entities/tour/TourDailyPath';
import { DataSource } from 'typeorm';

const seedBlogCategories = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(BlogCategory);

  let category = new BlogCategory();
  category.name = 'Türkiye';
  category.seoLink = 'turkiye';
  await repo.save(category);

  let subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Akdeniz';
  subCategory.seoLink = 'akdeniz';
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Doğu Anadolu';
  subCategory.seoLink = 'dogu-anadolu';
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Ege';
  subCategory.seoLink = 'ege';
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Güney Doğu Anadolu';
  subCategory.seoLink = 'guney-dogu-anadolu';
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'İç Anadolu';
  subCategory.seoLink = 'ic-anadolu';
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Karadeniz';
  subCategory.seoLink = 'karadeniz';
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Marmara';
  subCategory.seoLink = 'marmara';
  await repo.save(subCategory);

  category = new BlogCategory();
  category.name = 'Dünya';
  category.seoLink = 'dunya';
  await repo.save(category);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Avrupa';
  subCategory.seoLink = 'avrupa';
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Asya';
  subCategory.seoLink = 'asya';
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Amerika';
  subCategory.seoLink = 'amerika';
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Afrika';
  subCategory.seoLink = 'afrika';
  await repo.save(subCategory);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Avustralya';
  subCategory.seoLink = 'avustralya';
  await repo.save(subCategory);

  category = new BlogCategory();
  category.name = 'Rehberler';
  category.seoLink = 'rehberler';
  await repo.save(category);

  subCategory = new BlogCategory();
  subCategory.parent = category;
  subCategory.name = 'Gezilecek Yerler';
  subCategory.seoLink = 'gezilecek-yerler';
  await repo.save(subCategory);

  category = new BlogCategory();
  category.name = 'Eğlence';
  category.seoLink = 'eglence';
  await repo.save(category);

  category = new BlogCategory();
  category.name = 'Keşfet';
  category.seoLink = 'kesfet';
  await repo.save(category);

  category = new BlogCategory();
  category.name = 'Yeme & İçme';
  category.seoLink = 'yeme-icme';
  await repo.save(category);

  console.log('All blog categories have been seeded!');
};

export default seedBlogCategories;
