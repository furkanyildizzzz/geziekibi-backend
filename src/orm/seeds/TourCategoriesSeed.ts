import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { Image } from 'orm/entities/image/Image';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { TourDailyPath } from 'orm/entities/tour/TourDailyPath';
import { generateUniqueSeoLink } from 'shared/utils/generateSeoLink';
import { DataSource } from 'typeorm';

const seedTourCategories = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(TourCategory);

  let category = new TourCategory();
  category.name = 'Karadeniz Turu';
  category.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733314656/dev/category/2024-12-04/1/cwwrqmzum5dl2ll4vyy4.jpg',
      format: 'jpg',
      width: 262,
      height: 117,
      publicId: 'dev/category/2024-12-04/1/cwwrqmzum5dl2ll4vyy4',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733314656/dev/category/2024-12-04/1/cwwrqmzum5dl2ll4vyy4.jpg',
      order: 1,
      createdAt: new Date('2024-12-04T09:17:36.000Z'),
      originalName: 'karadeniz-turu-262-117.jpg',
    } as Image,
  ];
  category.seoLink = await generateUniqueSeoLink(category.name, 'tourCategory');
  category.insertUserId = 1;
  await repo.save(category);

  let subCategory = new TourCategory();
  subCategory.parent = category;
  subCategory.name = 'Bartın Turu';
  subCategory.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733314669/dev/category/2024-12-04/2/vlzyxxwm8ps7foyhohvf.jpg',
      format: 'jpg',
      width: 262,
      height: 117,
      publicId: 'dev/category/2024-12-04/2/vlzyxxwm8ps7foyhohvf',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733314669/dev/category/2024-12-04/2/vlzyxxwm8ps7foyhohvf.jpg',
      order: 1,
      createdAt: new Date('2024-12-04T09:17:49.000Z'),
      originalName: 'bartÄ±n-turu-262-117.jpg',
    } as Image,
  ];
  subCategory.seoLink = await generateUniqueSeoLink(subCategory.name, 'tourCategory');
  subCategory.insertUserId = 1;
  await repo.save(subCategory);

  subCategory = new TourCategory();
  subCategory.parent = category;
  subCategory.name = 'Batı Karadeniz Turu';
  subCategory.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733314809/dev/category/2024-12-04/3/vgi9b95zjp06dcejxxvu.jpg',
      format: 'jpg',
      width: 262,
      height: 117,
      publicId: 'dev/category/2024-12-04/3/vgi9b95zjp06dcejxxvu',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733314809/dev/category/2024-12-04/3/vgi9b95zjp06dcejxxvu.jpg',
      order: 1,
      createdAt: new Date('2024-12-04T09:20:09.000Z'),
      originalName: 'batÄ±-karadeniz-turu-262-117.jpg',
    } as Image,
  ];
  subCategory.seoLink = await generateUniqueSeoLink(subCategory.name, 'tourCategory');
  subCategory.insertUserId = 1;
  await repo.save(subCategory);

  subCategory = new TourCategory();
  subCategory.parent = category;
  subCategory.name = 'Doğu Karadeniz Turu';
  subCategory.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733315033/dev/category/2024-12-04/4/enzreo6ltgru7neskwkc.jpg',
      format: 'jpg',
      width: 294,
      height: 171,
      publicId: 'dev/category/2024-12-04/4/enzreo6ltgru7neskwkc',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733315033/dev/category/2024-12-04/4/enzreo6ltgru7neskwkc.jpg',
      order: 1,
      createdAt: new Date('2024-12-04T09:23:53.000Z'),
      originalName: 'dogÌu-karadeniz-turu-262-117.jpeg',
    } as Image,
  ];
  subCategory.seoLink = await generateUniqueSeoLink(subCategory.name, 'tourCategory');
  subCategory.insertUserId = 1;
  await repo.save(subCategory);

  category = new TourCategory();
  category.name = 'Ege Turu';
  category.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733315083/dev/category/2024-12-04/5/cpdu0ky59njfnpz334bs.webp',
      format: 'webp',
      width: 262,
      height: 117,
      publicId: 'dev/category/2024-12-04/5/cpdu0ky59njfnpz334bs',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733315083/dev/category/2024-12-04/5/cpdu0ky59njfnpz334bs.webp',
      order: 1,
      createdAt: new Date('2024-12-04T09:24:43.000Z'),
      originalName: 'ege-akdeniz-turu-262-117.webp',
    } as Image,
  ];
  category.seoLink = await generateUniqueSeoLink(category.name, 'tourCategory');
  category.insertUserId = 1;
  await repo.save(category);

  subCategory = new TourCategory();
  subCategory.parent = category;
  subCategory.name = 'Orta Ege Turu';
  subCategory.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733315166/dev/category/2024-12-04/6/fpbdnmpc2n1afavek6yh.webp',
      format: 'webp',
      width: 262,
      height: 117,
      publicId: 'dev/category/2024-12-04/6/fpbdnmpc2n1afavek6yh',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733315166/dev/category/2024-12-04/6/fpbdnmpc2n1afavek6yh.webp',
      order: 1,
      createdAt: new Date('2024-12-04T09:26:06.000Z'),
      originalName: 'orta-ege-turu-262-117.webp',
    } as Image,
  ];
  subCategory.seoLink = await generateUniqueSeoLink(subCategory.name, 'tourCategory');
  subCategory.insertUserId = 1;
  await repo.save(subCategory);

  subCategory = new TourCategory();
  subCategory.parent = category;
  subCategory.name = 'Güney Ege Turu';
  subCategory.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733315253/dev/category/2024-12-04/7/fmkl8tsfgqljxvy4ljxo.jpg',
      format: 'jpg',
      width: 262,
      height: 117,
      publicId: 'dev/category/2024-12-04/7/fmkl8tsfgqljxvy4ljxo',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733315253/dev/category/2024-12-04/7/fmkl8tsfgqljxvy4ljxo.jpg',
      order: 1,
      createdAt: new Date('2024-12-04T09:27:33.000Z'),
      originalName: 'guney-ege-turu-262-117.jpg',
    } as Image,
  ];
  subCategory.seoLink = await generateUniqueSeoLink(subCategory.name, 'tourCategory');
  subCategory.insertUserId = 1;
  await repo.save(subCategory);

  category = new TourCategory();
  category.name = 'Güneydoğu Turu';
  category.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733315280/dev/category/2024-12-04/8/oyn8y02hxk80m1rhb6bl.jpg',
      format: 'jpg',
      width: 262,
      height: 117,
      publicId: 'dev/category/2024-12-04/8/oyn8y02hxk80m1rhb6bl',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733315280/dev/category/2024-12-04/8/oyn8y02hxk80m1rhb6bl.jpg',
      order: 1,
      createdAt: new Date('2024-12-04T09:28:00.000Z'),
      originalName: 'nemrut-turu-262-117.jpg',
    } as Image,
  ];
  category.seoLink = await generateUniqueSeoLink(category.name, 'tourCategory');
  category.insertUserId = 1;
  await repo.save(category);

  subCategory = new TourCategory();
  subCategory.parent = category;
  subCategory.name = 'Mardin Turu';
  subCategory.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733315353/dev/category/2024-12-04/9/qxfnhm16nuxwewi3oron.jpg',
      format: 'jpg',
      width: 262,
      height: 117,
      publicId: 'dev/category/2024-12-04/9/qxfnhm16nuxwewi3oron',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733315353/dev/category/2024-12-04/9/qxfnhm16nuxwewi3oron.jpg',
      order: 1,
      createdAt: new Date('2024-12-04T09:29:13.000Z'),
      originalName: 'mardin-turu-262-117.jpg',
    } as Image,
  ];
  subCategory.seoLink = await generateUniqueSeoLink(subCategory.name, 'tourCategory');
  subCategory.insertUserId = 1;
  await repo.save(subCategory);

  category = new TourCategory();
  category.name = 'Doğu Anadolu Turu';
  category.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733315568/dev/category/2024-12-04/10/of9wm3hbwxywnklsgha8.jpg',
      format: 'jpg',
      width: 262,
      height: 117,
      publicId: 'dev/category/2024-12-04/10/of9wm3hbwxywnklsgha8',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733315568/dev/category/2024-12-04/10/of9wm3hbwxywnklsgha8.jpg',
      order: 1,
      createdAt: new Date('2024-12-04T09:32:48.000Z'),
      originalName: 'dogÌu-anadolu-turu-262-117.jpg',
    } as Image,
  ];
  category.seoLink = await generateUniqueSeoLink(category.name, 'tourCategory');
  category.insertUserId = 1;
  await repo.save(category);

  subCategory = new TourCategory();
  subCategory.parent = category;
  subCategory.name = 'Van Turu';
  subCategory.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733315579/dev/category/2024-12-04/11/qvihtzlpqcui9fdntgfr.webp',
      format: 'webp',
      width: 262,
      height: 117,
      publicId: 'dev/category/2024-12-04/11/qvihtzlpqcui9fdntgfr',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733315579/dev/category/2024-12-04/11/qvihtzlpqcui9fdntgfr.webp',
      order: 1,
      createdAt: new Date('2024-12-04T09:32:59.000Z'),
      originalName: 'van-turu-262-117.webp',
    } as Image,
  ];
  subCategory.seoLink = await generateUniqueSeoLink(subCategory.name, 'tourCategory');
  subCategory.insertUserId = 1;
  await repo.save(subCategory);

  category = new TourCategory();
  category.name = 'İç Anadolu Turu';
  category.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733315597/dev/category/2024-12-04/12/z0baelybskcdkzuedesj.jpg',
      format: 'jpg',
      width: 262,
      height: 117,
      publicId: 'dev/category/2024-12-04/12/z0baelybskcdkzuedesj',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733315597/dev/category/2024-12-04/12/z0baelybskcdkzuedesj.jpg',
      order: 1,
      createdAt: new Date('2024-12-04T09:33:17.000Z'),
      originalName: 'ankara-turu-262-117.jpg',
    } as Image,
  ];
  category.seoLink = await generateUniqueSeoLink(category.name, 'tourCategory');
  category.insertUserId = 1;
  await repo.save(category);

  subCategory = new TourCategory();
  subCategory.parent = category;
  subCategory.name = 'Kapadokya Turu';
  subCategory.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733315610/dev/category/2024-12-04/13/bmqqmlycd2i0majtg7bz.jpg',
      format: 'jpg',
      width: 262,
      height: 117,
      publicId: 'dev/category/2024-12-04/13/bmqqmlycd2i0majtg7bz',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733315610/dev/category/2024-12-04/13/bmqqmlycd2i0majtg7bz.jpg',
      order: 1,
      createdAt: new Date('2024-12-04T09:33:30.000Z'),
      originalName: 'kapadokya-turu-262-117.jpg',
    } as Image,
  ];
  subCategory.seoLink = await generateUniqueSeoLink(subCategory.name, 'tourCategory');
  subCategory.insertUserId = 1;
  await repo.save(subCategory);

  category = new TourCategory();
  category.name = 'Orta Avrupa - Balkan Turu';
  category.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733315848/dev/category/2024-12-04/14/tdduvw7l3yru95p4ixgr.jpg',
      format: 'jpg',
      width: 262,
      height: 117,
      publicId: 'dev/category/2024-12-04/14/tdduvw7l3yru95p4ixgr',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733315848/dev/category/2024-12-04/14/tdduvw7l3yru95p4ixgr.jpg',
      order: 1,
      createdAt: new Date('2024-12-04T09:37:28.000Z'),
      originalName: 'orta-avrupa-balkan-turu-262-117.jpg',
    } as Image,
  ];
  category.seoLink = await generateUniqueSeoLink(category.name, 'tourCategory');
  category.insertUserId = 1;
  await repo.save(category);

  category = new TourCategory();
  category.name = 'Avrupa Turu';
  category.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733315857/dev/category/2024-12-04/15/ngv2ff1cowmzdmq6qxig.jpg',
      format: 'jpg',
      width: 262,
      height: 117,
      publicId: 'dev/category/2024-12-04/15/ngv2ff1cowmzdmq6qxig',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733315857/dev/category/2024-12-04/15/ngv2ff1cowmzdmq6qxig.jpg',
      order: 1,
      createdAt: new Date('2024-12-04T09:37:37.000Z'),
      originalName: 'avrupa-turu-262-117.jpg',
    } as Image,
  ];
  category.seoLink = await generateUniqueSeoLink(category.name, 'tourCategory');
  category.insertUserId = 1;
  await repo.save(category);

  category = new TourCategory();
  category.name = 'İtalya - Yunanistan Turu';
  category.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733315866/dev/category/2024-12-04/16/uheyjxyi0aq587jtxk3j.jpg',
      format: 'jpg',
      width: 262,
      height: 117,
      publicId: 'dev/category/2024-12-04/16/uheyjxyi0aq587jtxk3j',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733315866/dev/category/2024-12-04/16/uheyjxyi0aq587jtxk3j.jpg',
      order: 1,
      createdAt: new Date('2024-12-04T09:37:46.000Z'),
      originalName: 'italya-yunanistan-turu-262-117.jpg',
    } as Image,
  ];
  category.seoLink = await generateUniqueSeoLink(category.name, 'tourCategory');
  category.insertUserId = 1;
  await repo.save(category);

  console.log('All tour categories have been seeded!');
};

export default seedTourCategories;
