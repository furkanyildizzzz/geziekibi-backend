import { TourCategory } from 'orm/entities/tour/TourCategory';
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTourCategories1730203128336 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const repo = getRepository(TourCategory);

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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
