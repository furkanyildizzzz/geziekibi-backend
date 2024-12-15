import { inject, injectable } from 'inversify';
import { CategoryDto, FeaturedTourDto } from '../dto/FeaturedTourDto';
import { IHomepageService } from '../interfaces/IHomepageService';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { Tour } from 'orm/entities/tour/Tour';
import { IsNull, LessThan, LessThanOrEqual } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import tourFunctions from 'shared/utils/tourFunctions';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { PublishStatus } from 'shared/utils/enum';
import { BlogDto } from '../dto/BlogDto';
import { Blog } from 'orm/entities/blog/Blog';
import { DailyPathDto } from '../dto/DailyPathDto';
import { TourDailyPath } from 'orm/entities/tour/TourDailyPath';

@injectable()
export class HomepageService implements IHomepageService {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork) {}

  public async getFeaturedTours(): Promise<FeaturedTourDto[]> {
    const tourRepo = await this.unitOfWork.getRepository(Tour);

    const today = new Date();
    const tours = await tourRepo.find({
      where: { dates: { startDate: LessThanOrEqual(today) }, publishStatus: PublishStatus.PUBLISH },
      order: {
        dates: {
          startDate: 'DESC',
        },
      },
      take: 3,
      relations: ['dates', 'dates.prices', 'primaryImages'],
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
      const { days, nights } = tourFunctions.calculateDaysAndNights(tour.startDate, tour.endDate);
      const daysAndNights = `${nights} gece/${days} gün`;
      featuredTour.daysAndNights = daysAndNights;

      return featuredTour;
    });

    return plainToInstance(FeaturedTourDto, featuredTours, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async getCategories(): Promise<CategoryDto[]> {
    const categoryRepo = await this.unitOfWork.getRepository(TourCategory);

    const categories = await categoryRepo.find({ where: { parent: IsNull() }, relations: ['parent', 'primaryImages'] });

    return plainToInstance(CategoryDto, categories, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async getTopTours(): Promise<FeaturedTourDto[]> {
    const tourRepo = await this.unitOfWork.getRepository(Tour);

    const today = new Date();
    const tours = await tourRepo.find({
      where: { dates: { startDate: LessThanOrEqual(today) }, publishStatus: PublishStatus.PUBLISH },
      order: {
        dates: {
          startDate: 'DESC',
        },
      },
      take: 6,
      relations: ['dates', 'dates.prices', 'primaryImages'],
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

      const { days, nights } = tourFunctions.calculateDaysAndNights(tour.startDate, tour.endDate);
      const daysAndNights = `${nights} gece/${days} gün`;
      featuredTour.daysAndNights = daysAndNights;

      return featuredTour;
    });

    return plainToInstance(FeaturedTourDto, featuredTours, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async getBlogs(): Promise<BlogDto[]> {
    const blogRepo = await this.unitOfWork.getRepository(Blog);

    const today = new Date();
    const blogs = await blogRepo.find({
      where: { publishDate: LessThanOrEqual(today), publishStatus: PublishStatus.PUBLISH },
      order: {
        publishDate: 'DESC',
      },
      take: 6,
      relations: ['tags', 'primaryImages', 'category'],
    });

    const blogList = blogs.map((b) => {
      const blog = new BlogDto();
      blog.id = b.id;
      blog.title = b.title;
      blog.seoLink = b.seoLink;
      blog.publishDate = b.publishDate;
      blog.comments = 6;
      blog.uploadedPrimaryImages = b.primaryImages;
      blog.tags = b.tags;
      blog.category = b.category;
      return blog;
    });

    return plainToInstance(BlogDto, blogList, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async getDailyPaths(): Promise<DailyPathDto[]> {
    const repo = await this.unitOfWork.getRepository(TourDailyPath);

    const dailyPaths = await repo.find();

    return plainToInstance(DailyPathDto, dailyPaths, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }
}
