import { inject, injectable } from 'inversify';
import { ITourRepositoryWeb } from '../interfaces/ITourRepositoryWeb';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { Tour } from 'orm/entities/tour/Tour';
import { InternalServerErrorException } from 'shared/errors/allException';
import TourService from 'orm/entities/tour/TourService';

@injectable()
export class TourRepositoryWeb implements ITourRepositoryWeb {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork) {}

  public async getAll(): Promise<Tour[] | void> {
    try {
      const repo = await this.unitOfWork.getRepository(Tour);
      const tours = await repo.find({ relations: ['tags', 'dates', 'category', 'tourServices', 'primaryImages'] });
      return tours;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  public async getById(id: number): Promise<Tour | void> {
    try {
      const repo = await this.unitOfWork.getRepository(Tour);
      const tour = await repo.findOne({
        where: { id: id },
        relations: [
          'tags',
          'dates',
          'dates.prices',
          'category',
          'tourServices',
          'primaryImages',
          'galleryImages',
          'tourServices.service',
          'dailyForms',
          'dailyForms.dailyPaths',
          'dailyForms.dailyVisitingPlaces',
        ],
      });
      if (tour) return tour as Tour;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  public async getBySeoLink(seoLink: string): Promise<Tour | void> {
    try {
      const repo = await this.unitOfWork.getRepository(Tour);
      // const tour = await repo.findOne({
      //   where: { seoLink: seoLink },
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
      //      'dailyForms.dailyVisitingPlaces',
      //   ],
      // });
      const tour = await repo
        .createQueryBuilder('tour')
        .leftJoinAndSelect('tour.tags', 'tags')
        .leftJoinAndSelect('tour.dates', 'dates')
        .leftJoinAndSelect('dates.prices', 'prices')
        .leftJoinAndSelect('tour.category', 'category')
        .leftJoinAndSelect('tour.tourServices', 'tourServices')
        .leftJoinAndSelect('tourServices.service', 'service')
        .leftJoinAndSelect('tour.dailyForms', 'dailyForms')
        .leftJoinAndSelect('dailyForms.dailyPaths', 'dailyPaths')
        .leftJoinAndSelect('dailyForms.dailyVisitingPlaces', 'dailyVisitingPlaces')
        .leftJoinAndSelect('tour.primaryImages', 'primaryImages')
        .leftJoinAndSelect('tour.galleryImages', 'galleryImages')
        .where('tour.seoLink = :seoLink', { seoLink })
        .getOne();

      if (tour) return tour as Tour;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }
  public async save(newTour: Tour): Promise<Tour> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(Tour)).save(newTour);
      await this.unitOfWork.commitTransaction();
      return newTour;
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }
  public async update(id: number, tour: Tour): Promise<Tour> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(Tour)).save({ id, ...tour });
      await this.unitOfWork.commitTransaction();
      return tour;
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }
  public async delete(id: number): Promise<void> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(Tour)).delete(id);
      await this.unitOfWork.commitTransaction();
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }
}
