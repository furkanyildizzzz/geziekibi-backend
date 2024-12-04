import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { TourDailyPath } from 'orm/entities/tour/TourDailyPath';
import { DataSource } from 'typeorm';

const seedTourCategories = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(TourCategory);

  let category = new TourCategory();
  category.name = 'Karadeniz Turu';
  await repo.save(category);

  let subCategory = new TourCategory();
  subCategory.parent = category;
  subCategory.name = 'Bartın Turu';
  await repo.save(subCategory);

  subCategory = new TourCategory();
  subCategory.parent = category;
  subCategory.name = 'Batı Karadeniz Turu';
  await repo.save(subCategory);

  subCategory = new TourCategory();
  subCategory.parent = category;
  subCategory.name = 'Doğu Karadeniz Turu';
  await repo.save(subCategory);

  category = new TourCategory();
  category.name = 'Ege Turu';
  await repo.save(category);

  subCategory = new TourCategory();
  subCategory.parent = category;
  subCategory.name = 'Orta Ege Turu';
  await repo.save(subCategory);

  subCategory = new TourCategory();
  subCategory.parent = category;
  subCategory.name = 'Güney Ege Turu';
  await repo.save(subCategory);

  category = new TourCategory();
  category.name = 'Güneydoğu Turu';
  await repo.save(category);

  subCategory = new TourCategory();
  subCategory.parent = category;
  subCategory.name = 'Mardin Turu';
  await repo.save(subCategory);

  category = new TourCategory();
  category.name = 'Doğu Anadolu Turu';
  await repo.save(category);

  subCategory = new TourCategory();
  subCategory.parent = category;
  subCategory.name = 'Van Turu';
  await repo.save(subCategory);

  category = new TourCategory();
  category.name = 'İç Anadolu Turu';
  await repo.save(category);

  subCategory = new TourCategory();
  subCategory.parent = category;
  subCategory.name = 'Kapadokya Turu';
  await repo.save(subCategory);

  category = new TourCategory();
  category.name = 'Orta Avrupa - Balkan Turu';
  await repo.save(category);

  category = new TourCategory();
  category.name = 'Avrupa Turu';
  await repo.save(category);

  category = new TourCategory();
  category.name = 'İtalya - Yunanistan Turu';
  await repo.save(category);

  console.log('All tour categories have been seeded!');
};

export default seedTourCategories;
