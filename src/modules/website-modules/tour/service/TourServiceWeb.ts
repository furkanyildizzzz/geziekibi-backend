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
import TourServiceEntity from 'orm/entities/tour/TourService';
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

@injectable()
export class TourServiceWeb implements ITourServiceWeb {
  constructor(
    @inject(INTERFACE_TYPE.ITourRepositoryWeb) private readonly repository: ITourRepositoryWeb,
    @inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork,
    @inject(INTERFACE_TYPE.ISeoLinkService) private readonly seoLinkService: ISeoLinkService,
    @inject(INTERFACE_TYPE.ITourCategoryRepository) private readonly categoryRepository: ITourCategoryRepository,
  ) {}

  public async getAll(categoryId): Promise<FeaturedTourDto[]> {
    const tourRepo = await this.unitOfWork.getRepository(Tour);
    const categoryRepo = await this.unitOfWork.getRepository(TourCategory);

    const today = new Date();
    // Build the where clause dynamically
    const whereCondition: any = {
      dates: { startDate: LessThanOrEqual(today) },
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
    const tours = await tourRepo.find({
      where: whereCondition,
      order: {
        dates: {
          startDate: 'DESC',
        },
      },
      relations: ['dates', 'dates.prices', 'primaryImages', 'category'],
    });
    console.log({ tours });

    const toursWithMostRecentDate = tours.map((tour) => {
      const mostRecentDate = tour.dates.reduce((latest, current) => {
        return current.startDate > latest.startDate ? current : latest;
      }, tour.dates[0]);

      return {
        ...tour,
        dates: [{ ...mostRecentDate, prices: [mostRecentDate.prices[0]] }], // Include only the most recent date
      };
    });

    const categoryIdsAndTourCount = (await categoryRepo.find({ relations: ['tours'] })).map((s) => {
      return { id: s.id, tourCount: s.tours.length };
    });
    const featuredTours = toursWithMostRecentDate.map((tour) => {
      const featuredTour = new FeaturedTourDto();
      featuredTour.id = tour.id;
      featuredTour.title = tour.title;
      featuredTour.seoLink = tour.seoLink;
      featuredTour.startDate = tour.startDate;
      featuredTour.endDate = tour.endDate;
      featuredTour.pricePerPerson = tour.dates[0].prices[0].price;
      featuredTour.dates = tour.dates;
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
    const tourRepo = await this.unitOfWork.getRepository(Tour);
    const categoryRepo = await this.unitOfWork.getRepository(TourCategory);

    const whereConditions: any = {
      publishStatus: PublishStatus.PUBLISH,
    };

    // Add `startDate` condition if provided
    if (searchParams.startDate) {
      whereConditions.dates = {
        ...(whereConditions.dates || {}),
        startDate: MoreThanOrEqual(searchParams.startDate),
      };
    }

    // Add `destination` condition if provided
    if (searchParams.destination?.id) {
      whereConditions.dailyForms = {
        ...(whereConditions.dailyForms || {}),
        dailyPaths: { id: Equal(searchParams.destination.id) },
      };
    }

    // Execute query with dynamic conditions
    const tours = await tourRepo.find({
      where: whereConditions,
      order: {
        dates: {
          startDate: 'DESC',
        },
      },
      relations: ['dates', 'dates.prices', 'primaryImages', 'category', 'dailyForms', 'dailyForms.dailyPaths'],
    });
    const toursWithMostRecentDate = tours.map((tour) => {
      const mostRecentDate = tour.dates.reduce((latest, current) => {
        return current.startDate > latest.startDate ? current : latest;
      }, tour.dates[0]);

      return {
        ...tour,
        dates: [{ ...mostRecentDate, prices: [mostRecentDate.prices[0]] }], // Include only the most recent date
      };
    });

    const categoryIdsAndTourCount = (await categoryRepo.find({ relations: ['tours'] })).map((s) => {
      return { id: s.id, tourCount: s.tours.length };
    });
    const featuredTours = toursWithMostRecentDate.map((tour) => {
      const featuredTour = new FeaturedTourDto();
      featuredTour.id = tour.id;
      featuredTour.title = tour.title;
      featuredTour.seoLink = tour.seoLink;
      featuredTour.startDate = tour.startDate;
      featuredTour.endDate = tour.endDate;
      featuredTour.pricePerPerson = tour.dates[0].prices[0].price;
      featuredTour.dates = tour.dates;
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
