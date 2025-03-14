import { inject, injectable } from 'inversify';
import { ITourRepositoryWeb } from '../interfaces/ITourRepositoryWeb';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { Tour } from 'orm/entities/tour/Tour';
import { InternalServerErrorException, NotFoundException } from 'shared/errors/allException';
import { TourService } from 'orm/entities/tour/TourService';
import { Tag } from 'orm/entities/tag/Tag';
import { TourDate } from 'orm/entities/tour/TourDate';
import { TourDaily } from 'orm/entities/tour/TourDaily';
import { Image } from 'orm/entities/image/Image';

@injectable()
export class TourRepositoryWeb implements ITourRepositoryWeb {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork) { }

  public async getAll(): Promise<Tour[] | void> {
    try {
      const repo = await this.unitOfWork.getRepository(Tour);
      const tours = await repo.find({ relations: ['tags', 'tourDates', 'category', 'tourServices', 'primaryImages'] });
      return tours;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  public async getById(id: number): Promise<Tour | void> {
    try {
      const repo = await this.unitOfWork.getRepository(Tour);
      // const tour = await repo.findOne({
      //   where: { id: id },
      //   relations: [
      //     'tags',
      //     'dates',
      //     'dates.prices',
      //     'category',
      //     'tourServices',
      //     'primaryImages',
      //     'galleryImages',
      //     'tourServices.service',
      //     'dailyForms',
      //     'dailyForms.dailyPaths',
      //     'dailyForms.dailyVisitingPlaces',
      //   ],
      //   order:{dailyForms:{id}}
      // });
      const tour = await repo
        .createQueryBuilder('tour')
        .leftJoinAndSelect('tour.tags', 'tags')
        .leftJoinAndSelect('tour.tourDates', 'tourDates')
        .leftJoinAndSelect('tourDates.prices', 'prices')
        .leftJoinAndSelect('tour.category', 'category')
        .leftJoinAndSelect('tour.tourServices', 'tourServices')
        .leftJoinAndSelect('tourServices.service', 'service')
        .leftJoinAndSelect('tour.primaryImages', 'primaryImages')
        .leftJoinAndSelect('tour.galleryImages', 'galleryImages')
        .leftJoinAndSelect('tour.dailyForms', 'dailyForms')
        .leftJoinAndSelect('dailyForms.dailyPaths', 'dailyPaths')
        .leftJoinAndSelect('dailyForms.dailyVisitingPlaces', 'dailyVisitingPlaces')
        .where('tour.id = :id', { id })
        .andWhere('tourDates.startDate >= CURRENT_DATE') // Bugün ve sonrası olan turlar
        .orderBy('dailyForms.id', 'DESC') // Order by dailyForms id
        .getOne();
      console.log(tour.tourDates)
      if (tour) return tour as Tour;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  public async getBySeoLink(seoLink: string): Promise<Tour | void> {
    try {
      // const repo = await this.unitOfWork.getRepository(Tour);
      // const tour = await repo
      //   .createQueryBuilder('tour')
      //   .leftJoinAndSelect('tour.tags', 'tags')
      //   .leftJoinAndSelect('tour.dates', 'dates')
      //   .leftJoinAndSelect('dates.prices', 'prices')
      //   .leftJoinAndSelect('tour.category', 'category')
      //   .leftJoinAndSelect('tour.tourServices', 'tourServices')
      //   .leftJoinAndSelect('tourServices.service', 'service')
      //   .leftJoinAndSelect('tour.dailyForms', 'dailyForms')
      //   .leftJoinAndSelect('dailyForms.dailyPaths', 'dailyPaths')
      //   .leftJoinAndSelect('dailyForms.dailyVisitingPlaces', 'dailyVisitingPlaces')
      //   .leftJoinAndSelect('tour.primaryImages', 'primaryImages')
      //   .leftJoinAndSelect('tour.galleryImages', 'galleryImages')
      //   .where(`tour.seoLink = '${seoLink}'`)
      //   .limit(1)
      //   .getOne();

      const repo = await this.unitOfWork.getRepository(Tour);

      // Step 1: Fetch the main tour entity with minimal data
      const tour = await repo
        .createQueryBuilder('tour')
        .leftJoin('users', 'insertUser', 'insertUser.id = tour.insertUserId')
        .leftJoin('users', 'updateUser', 'updateUser.id = tour.updateUserId')
        .leftJoinAndSelect('tour.category', 'category') // Include only critical joins
        .leftJoinAndSelect('tour.tags', 'tags')
        .where('(insertUser.role = :adminRole OR updateUser.role = :adminRole)', { adminRole: 'ADMINISTRATOR' })
        .andWhere('tour.seoLink = :seoLink', { seoLink })
        .getOne();

      if (!tour) throw new NotFoundException('Tour not found');

      // Step 2: Fetch related data separately
      const repoTag = await this.unitOfWork.getRepository(Tag);
      const repoTourDate = await this.unitOfWork.getRepository(TourDate);
      const repoTourService = await this.unitOfWork.getRepository(TourService);
      const repoTourDaily = await this.unitOfWork.getRepository(TourDaily);
      const repoImage = await this.unitOfWork.getRepository(Image);

      const tourId = tour.id;

      // Step 2: Fetch related data concurrently
      const [dates, tourServices, dailyForms, galleryImages, primaryImages] = await Promise.all([
        // Load tags
        // repoTag
        //   .createQueryBuilder('tags')
        //   .leftJoin('tags.tours', 'tour')
        //   .where('tour.id = :tourId', { tourId })
        //   .getMany(),

        // Load dates and prices
        repoTourDate
          .createQueryBuilder('tourDates')
          .leftJoinAndSelect('tourDates.prices', 'prices')
          .where('tourDates.tourId = :tourId', { tourId })
          .andWhere('tourDates.startDate >= CURRENT_DATE') // Bugün ve sonrası olan turlar
          .getMany(),

        // Load tour services and their related services
        repoTourService
          .createQueryBuilder('tour_services')
          .leftJoinAndSelect('tour_services.service', 'service')
          .where('tour_services.tour_id = :tourId', { tourId })
          .getMany(),

        // Load daily forms, paths, and visiting places
        repoTourDaily
          .createQueryBuilder('tourDaily')
          .leftJoinAndSelect('tourDaily.dailyPaths', 'dailyPaths')
          .leftJoinAndSelect('tourDaily.dailyVisitingPlaces', 'dailyVisitingPlaces')
          .where('tourDaily.tour_id = :tourId', { tourId })
          .orderBy('tourDaily.id', 'ASC') // Add the ORDER BY clause
          .getMany(),

        // Load gallery images
        repoImage.createQueryBuilder('images').where('images.tourId = :tourId', { tourId }).getMany(),

        // Load primary images
        repoImage.createQueryBuilder('images').where('images.primaryForTourId = :tourId', { tourId }).getMany(),
      ]);

      // Step 3: Attach related data to the main entity
      // tour.tags = tags;
      tour.tourDates = dates;
      tour.tourServices = tourServices;
      tour.dailyForms = dailyForms;
      tour.galleryImages = galleryImages;
      tour.primaryImages = primaryImages;
      console.log(tour);
      if (tour) return tour as Tour;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }
}
