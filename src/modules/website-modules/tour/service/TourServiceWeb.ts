import { inject, injectable } from 'inversify';
import { ITourServiceWeb } from '../interfaces/ITourServiceWeb';
import { INTERFACE_TYPE } from 'core/types';
import { ITourRepositoryWeb } from '../interfaces/ITourRepositoryWeb';
import { TourListDtoWeb } from '../dto/TourListDtoWeb';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, InternalServerErrorException, NotFoundException } from 'shared/errors/allException';
import { TourDtoWeb } from '../dto/TourDtoWeb';
import { ITourCategoryRepository } from 'modules/tourCategory/interfaces/ITourCategoryRepository';
import { ITagRepository } from 'modules/tag/interfaces/ITagRepository';
import { IServiceRepository } from 'modules/service/interfaces/IServiceRepository';
import { Tag } from 'orm/entities/tag/Tag';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { Service } from 'orm/entities/service/Service';
import { TourService as TourServiceEntity } from 'orm/entities/tour/TourService';
import { Equal, In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Currency, PublishStatus, ServiceType } from 'shared/utils/enum';
import { TourPrice } from 'orm/entities/tour/TourPrice';
import { v2 } from 'cloudinary';
import { Image } from 'orm/entities/image/Image';
import { Tour } from 'orm/entities/tour/Tour';
import { TourDaily } from 'orm/entities/tour/TourDaily';
import { TourDailyPath } from 'orm/entities/tour/TourDailyPath';
import { TourDailyVisitingPlace } from 'orm/entities/tour/TourDailyVisitingPlace';
import { TourDate } from 'orm/entities/tour/TourDate';
import { ISeoLinkService } from 'shared/interfaces/ISeoLinkService';
import tourFunctions from 'shared/utils/tourFunctions';
import { FeaturedTourDto } from 'modules/website-modules/homepage/dto/FeaturedTourDto';
import { equal } from 'assert';
import { CategoryDto } from 'modules/website-modules/homepage/dto/CategoryDto';
import { User } from 'orm/entities/users/User';

@injectable()
export class TourServiceWeb implements ITourServiceWeb {
  constructor(
    @inject(INTERFACE_TYPE.ITourRepositoryWeb) private readonly repository: ITourRepositoryWeb,
    @inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork,
    @inject(INTERFACE_TYPE.ISeoLinkService) private readonly seoLinkService: ISeoLinkService,
    @inject(INTERFACE_TYPE.ITourCategoryRepository) private readonly categoryRepository: ITourCategoryRepository,
  ) { }

  public async getAll(categoryId): Promise<FeaturedTourDto[]> {
    const tourRepo = await this.unitOfWork.getRepository(Tour);
    const categoryRepo = await this.unitOfWork.getRepository(TourCategory);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Günün başlangıcına ayarla

    // Build the where clause dynamically
    const whereCondition: any = {
      tourDates: { startDate: MoreThanOrEqual(today) },
      publishStatus: PublishStatus.PUBLISH,
    };

    // Find all category IDs including subcategories
    let categoryIds: number[] = [];
    if (categoryId) {
      const rootCategory = await categoryRepo.findOne({
        where: { id: categoryId },
        relations: ['subCategories'], // Load subcategories
      });

      if (rootCategory) {
        categoryIds = this.getAllCategoryIds(rootCategory);
      }
    }
    // Add category filter if category IDs are present
    if (categoryIds.length > 0) {
      whereCondition.category = { id: In(categoryIds) }; // Use TypeORM's In operator
    }

    // Query with the dynamically built where condition
    // const tours = await tourRepo.find({
    //   where: whereCondition,
    //   order: {
    //     tourDates: {
    //       startDate: 'DESC',
    //     },
    //   },
    //   relations: ['tourDates', 'tourDates.prices', 'primaryImages', 'category'],
    // });

    const query = tourRepo
      .createQueryBuilder('tour')
      .leftJoin('users', 'insertUser', 'insertUser.id = tour.insertUserId')
      .leftJoin('users', 'updateUser', 'updateUser.id = tour.updateUserId')
      .where('(insertUser.role = :adminRole OR updateUser.role = :adminRole)', { adminRole: 'ADMINISTRATOR' })
      .andWhere('tour.publishStatus = :publishStatus', { publishStatus: PublishStatus.PUBLISH })
      .andWhere('tourDates.startDate >= :today', { today })
      .leftJoinAndSelect('tour.tourDates', 'tourDates')
      .leftJoinAndSelect('tourDates.prices', 'prices') // TourDates içindeki Prices ilişkisini ekledik
      .leftJoinAndSelect('tour.primaryImages', 'primaryImages')
      .leftJoinAndSelect('tour.category', 'category')
      .orderBy('tourDates.startDate', 'DESC')

    if (categoryIds.length > 0) {
      query.andWhere('tour.category.id IN (:...categoryIds)', { categoryIds });
    }
    const tours = await query.getMany();

    if (tours.length == 0) return []

    const toursWithMostRecentDate = tours.map((tour) => {
      const mostRecentDate = tour.tourDates.reduce((latest, current) => {
        return current.startDate > latest.startDate ? current : latest;
      }, tour.tourDates[0]);

      return {
        ...tour,
        tourDates: [{ ...mostRecentDate, prices: [mostRecentDate.prices[0]] }], // Include only the most recent date
      };
    });

    // const categoryIdsAndTourCount = (await categoryRepo.find({ where: { tours: { id: In(toursWithMostRecentDate.map(t => t.id)) } }, relations: ['tours'] })).map((s) => {
    //   return { id: s.id, tourCount: s.tours.length };
    // });
    const categoryIdsAndTourCount = await categoryRepo
      .createQueryBuilder('category')
      .leftJoin('category.tours', 'tour')
      .where('tour.id IN (:...tourIds)', { tourIds: toursWithMostRecentDate.map(t => t.id) })
      .select('category.id', 'id')
      .addSelect('COUNT(tour.id)', 'tourCount')
      .groupBy('category.id')
      .getRawMany();

    const featuredTours = toursWithMostRecentDate.map((tour) => {
      const featuredTour = new FeaturedTourDto();
      featuredTour.id = tour.id;
      featuredTour.title = tour.title;
      featuredTour.seoLink = tour.seoLink;
      featuredTour.startDate = tour.startDate;
      featuredTour.endDate = tour.endDate;
      featuredTour.pricePerPerson = tour.tourDates[0].prices[0].price;
      featuredTour.tourDates = tour.tourDates;
      featuredTour.uploadedPrimaryImages = tour.primaryImages;
      featuredTour.category = {
        ...tour.category,
        tourCount: categoryIdsAndTourCount.find((s) => (s.id = tour.category.id)).tourCount,
      };
      const { days, nights } = tourFunctions.calculateDaysAndNights(tour.startDate, tour.endDate);
      const daysAndNights = `${nights} gece/${days} gün`;
      featuredTour.daysAndNights = daysAndNights;

      return featuredTour;
    });

    if (featuredTours && featuredTours.length)
      return plainToInstance(FeaturedTourDto, featuredTours, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    return [];
  }
  public async getBySeoLink(seoLink: string): Promise<TourDtoWeb> {
    const tour = await this.repository.getBySeoLink(seoLink);
    if (!tour) throw new NotFoundException(`Tour with seoLink:${seoLink} not found`);
    const { days, nights } = tourFunctions.calculateDaysAndNights(tour.startDate, tour.endDate);
    const daysAndNights = `${nights} gece/${days} gün`;

    return plainToInstance(
      TourDtoWeb,
      { ...tour, daysAndNights },
      {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      },
    );
  }

  public async getCategoryBySeoLink(seoLink: string): Promise<CategoryDto> {
    const tourCategory = await this.categoryRepository.getBySeoLink(seoLink);
    if (!tourCategory) throw new NotFoundException(`Tour with seoLink:${seoLink} not found`);

    return plainToInstance(CategoryDto, tourCategory, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async searchTours(searchParams): Promise<FeaturedTourDto[]> {
    // const tourRepo = await this.unitOfWork.getRepository(Tour);
    // const categoryRepo = await this.unitOfWork.getRepository(TourCategory);

    // const today = new Date();
    // const whereConditions: any = {
    //   tourDates: { startDate: MoreThanOrEqual(today) },
    //   publishStatus: PublishStatus.PUBLISH,
    // };

    // // Add `startDate` condition if provided
    // if (searchParams.startDate) {
    //   whereConditions.tourDates = {
    //     ...(whereConditions.tourDates || {}),
    //     startDate: MoreThanOrEqual(searchParams.startDate),
    //   };
    // }

    // // Add `destination` condition if provided
    // if (searchParams.destination?.id) {
    //   whereConditions.dailyForms = {
    //     ...(whereConditions.dailyForms || {}),
    //     dailyPaths: { id: Equal(searchParams.destination.id) },
    //   };
    // }

    // // Find all category IDs including subcategories
    // let categoryIds: number[] = [];
    // if (searchParams.categoryId) {
    //   const rootCategory = await categoryRepo.findOne({
    //     where: { id: searchParams.categoryId },
    //     relations: ['subCategories'], // Load subcategories
    //   });

    //   if (rootCategory) {
    //     categoryIds = this.getAllCategoryIds(rootCategory);
    //   }
    // }
    // // Add category filter if category IDs are present
    // if (categoryIds.length > 0) {
    //   whereConditions.category = { id: In(categoryIds) }; // Use TypeORM's In operator
    // }

    // console.log({ whereConditions })

    // //Execute query with dynamic conditions
    // const tours = await tourRepo.find({
    //   where: whereConditions,
    //   order: {
    //     tourDates: {
    //       startDate: 'DESC',
    //     },
    //   },
    //   relations: ['tourDates', 'tourDates.prices', 'primaryImages', 'category', 'dailyForms', 'dailyForms.dailyPaths'],
    // });


    const tourRepo = await this.unitOfWork.getRepository(Tour);
    const categoryRepo = await this.unitOfWork.getRepository(TourCategory);

    const today = new Date();

    // Query Builder başlat
    let queryBuilder = tourRepo
      .createQueryBuilder('tour')
      .leftJoinAndSelect('tour.tourDates', 'tourDates')
      .leftJoinAndSelect('tourDates.prices', 'prices')
      .leftJoinAndSelect('tour.primaryImages', 'primaryImages')
      .leftJoinAndSelect('tour.category', 'category')
      .leftJoinAndSelect('tour.dailyForms', 'dailyForms')
      .leftJoinAndSelect('dailyForms.dailyPaths', 'dailyPaths')
      .where('tour.publishStatus = :publishStatus', { publishStatus: PublishStatus.PUBLISH })
      .andWhere('tourDates.startDate >= :today', { today });

    // ✅ Dinamik `where` koşulları burada ekleniyor

    // Eğer `searchParams.startDate` varsa
    if (searchParams.startDate) {
      queryBuilder = queryBuilder.andWhere('tourDates.startDate >= :startDate', {
        startDate: searchParams.startDate,
      });
    }

    // Eğer `searchParams.destination?.id` varsa
    if (searchParams.destination?.id) {
      queryBuilder = queryBuilder.andWhere('dailyPaths.id = :destinationId', {
        destinationId: searchParams.destination.id,
      });
    }

    // Eğer kategori ID'si varsa ve alt kategoriler de dahilse
    let categoryIds: number[] = [];
    if (searchParams.categoryId) {
      const rootCategory = await categoryRepo.findOne({
        where: { id: searchParams.categoryId },
        relations: ['subCategories'], // Load subcategories
      });

      if (rootCategory) {
        categoryIds = this.getAllCategoryIds(rootCategory);
      }

      if (categoryIds.length > 0) {
        queryBuilder = queryBuilder.andWhere('category.id IN (:...categoryIds)', {
          categoryIds,
        });
      }
    }

    // Kullanıcı yetkisine göre filtreleme (subquery)
    queryBuilder = queryBuilder.andWhere(qb => {
      const subQuery = qb
        .subQuery()
        .select('user.id')
        .from('users', 'user')
        .where('user.role = :role')
        .getQuery();
      return `tour.insertUserId IN ${subQuery}`;
    }).setParameter('role', 'ADMINISTRATOR');

    // Sıralama ekleniyor
    queryBuilder = queryBuilder.orderBy('tourDates.startDate', 'DESC');

    // Sonuçları getir
    const tours = await queryBuilder.getMany();

    if (tours.length == 0) return []

    const toursWithMostRecentDate = tours.map((tour) => {
      const mostRecentDate = tour.tourDates.reduce((latest, current) => {
        return current.startDate > latest.startDate ? current : latest;
      }, tour.tourDates[0]);

      return {
        ...tour,
        tourDates: [{ ...mostRecentDate, prices: [mostRecentDate.prices[0]] }], // Include only the most recent date
      };
    });

    // const categoryIdsAndTourCount = (await categoryRepo.find({ relations: ['tours'] })).map((s) => {
    //   return { id: s.id, tourCount: s.tours.length };
    // });
    const categoryIdsAndTourCount = await categoryRepo
      .createQueryBuilder('category')
      .leftJoin('category.tours', 'tour')
      .where('tour.id IN (:...tourIds)', { tourIds: toursWithMostRecentDate.map(t => t.id) })
      .select('category.id', 'id')
      .addSelect('COUNT(tour.id)', 'tourCount')
      .groupBy('category.id')
      .getRawMany();

    const featuredTours = toursWithMostRecentDate.map((tour) => {
      const featuredTour = new FeaturedTourDto();
      featuredTour.id = tour.id;
      featuredTour.title = tour.title;
      featuredTour.seoLink = tour.seoLink;
      featuredTour.startDate = tour.startDate;
      featuredTour.endDate = tour.endDate;
      featuredTour.pricePerPerson = tour.tourDates[0].prices[0].price;
      featuredTour.tourDates = tour.tourDates;
      featuredTour.uploadedPrimaryImages = tour.primaryImages;
      featuredTour.category = {
        ...tour.category,
        tourCount: categoryIdsAndTourCount.find((s) => (s.id = tour.category.id)).tourCount,
      };
      const { days, nights } = tourFunctions.calculateDaysAndNights(tour.startDate, tour.endDate);
      const daysAndNights = `${nights} gece/${days} gün`;
      featuredTour.daysAndNights = daysAndNights;

      return featuredTour;
    });

    console.log({ featuredTours })


    if (featuredTours && featuredTours.length)
      return plainToInstance(FeaturedTourDto, featuredTours, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    return [];
  }

  private getAllCategoryIds(category: TourCategory): number[] {
    const categoryIds = [category.id];
    if (category.subCategories) {
      for (const subCategory of category.subCategories) {
        categoryIds.push(...this.getAllCategoryIds(subCategory));
      }
    }
    return categoryIds;
  }
}
