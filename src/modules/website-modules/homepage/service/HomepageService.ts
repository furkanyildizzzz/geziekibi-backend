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

@injectable()
export class HomepageService implements IHomepageService {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork) {}

  public async getFeaturedTours(): Promise<FeaturedTourDto[]> {
    const tourRepo = await this.unitOfWork.getRepository(Tour);

    const today = new Date();
    const tours = await tourRepo.find({
      where: { dates: { tourDate: LessThanOrEqual(today) } },
      order: {
        dates: {
          tourDate: 'DESC',
        },
      },
      take: 3,
      relations: ['dates', 'dates.prices', 'primaryImages'],
    });

    const toursWithMostRecentDate = tours.map((tour) => {
      const mostRecentDate = tour.dates.reduce((latest, current) => {
        return current.tourDate > latest.tourDate ? current : latest;
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
      where: { dates: { tourDate: LessThanOrEqual(today) } },
      order: {
        dates: {
          tourDate: 'DESC',
        },
      },
      take: 6,
      relations: ['dates', 'dates.prices', 'primaryImages'],
    });

    const toursWithMostRecentDate = tours.map((tour) => {
      const mostRecentDate = tour.dates.reduce((latest, current) => {
        return current.tourDate > latest.tourDate ? current : latest;
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
}
