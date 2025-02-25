import { inject, injectable } from 'inversify';
import { ITourService } from '../interfaces/ITourService';
import { INTERFACE_TYPE } from 'core/types';
import { ITourRepository } from '../interfaces/ITourRepository';
import { CreateTourDto } from '../dto/CreateTourDto';
import { TourListDto } from '../dto/TourListDto';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, InternalServerErrorException, NotFoundException } from 'shared/errors/allException';
import { TourDto } from '../dto/TourDto';
import { EditTourDto } from '../dto/EditTourDto';
import { ITourCategoryRepository } from 'modules/tourCategory/interfaces/ITourCategoryRepository';
import { ITagRepository } from 'modules/tag/interfaces/ITagRepository';
import { IServiceRepository } from 'modules/service/interfaces/IServiceRepository';
import { Tag } from 'orm/entities/tag/Tag';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { Service } from 'orm/entities/service/Service';
import { TourService as TourServiceEntity } from 'orm/entities/tour/TourService';
import { In, Repository } from 'typeorm';
import { Currency, ServiceType } from 'shared/utils/enum';
import { TourPrice } from 'orm/entities/tour/TourPrice';
import { v2 } from 'cloudinary';
import { Image } from 'orm/entities/image/Image';
import { Tour } from 'orm/entities/tour/Tour';
import { TourDaily } from 'orm/entities/tour/TourDaily';
import { TourDailyPath } from 'orm/entities/tour/TourDailyPath';
import { TourDailyVisitingPlace } from 'orm/entities/tour/TourDailyVisitingPlace';
import { TourDate } from 'orm/entities/tour/TourDate';
import { ISeoLinkService } from 'shared/interfaces/ISeoLinkService';

@injectable()
export class TourService implements ITourService {
  constructor(
    @inject(INTERFACE_TYPE.ITourRepository) private readonly repository: ITourRepository,
    @inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork,
    @inject(INTERFACE_TYPE.ISeoLinkService) private readonly seoLinkService: ISeoLinkService,
  ) {}

  public async getAll(): Promise<TourListDto[]> {
    const tours = await this.repository.getAll();
    if (tours && tours.length)
      return plainToInstance(TourListDto, tours, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    return [];
  }

  public async getById(id: string): Promise<TourDto> {
    const tour = await this.repository.getById(Number(id));
    if (!tour) throw new NotFoundException(`Tour with id:${id} not found`);
    return plainToInstance(TourDto, tour, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async getBySeoLink(seoLink: string): Promise<TourDto> {
    const tour = await this.repository.getBySeoLink(seoLink);
    if (!tour) throw new NotFoundException(`Tour with seoLink:${seoLink} not found`);
    return plainToInstance(TourDto, tour, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async createTour(tourData: CreateTourDto): Promise<TourDto> {
    await this.unitOfWork.startTransaction();
    const categoryRepository = await this.unitOfWork.getRepository(TourCategory);
    const tagRepository = await this.unitOfWork.getRepository(Tag);
    const serviceRepository = await this.unitOfWork.getRepository(Service);
    const tourServiceRepository = await this.unitOfWork.getRepository(TourServiceEntity);
    const ImageRepository = await this.unitOfWork.getRepository(Image);
    const tourDailyPathRepository = await this.unitOfWork.getRepository(TourDailyPath);

    const category = await categoryRepository.findOne({ where: { id: tourData.category.id } });
    if (!category) {
      await this.unitOfWork.rollbackTransaction();
      throw new NotFoundException(`Tour Category with id:${tourData.category.id} not found`);
    }
    const tags = (await tagRepository.find()) as Tag[];
    if (tourData.tags && tourData.tags.length > 0) {
      const tagIds = tourData.tags.map((s) => s.id);
      if (!tags || !(tags.filter((t) => tagIds.includes(t.id)).length === tagIds.length)) {
        await this.unitOfWork.rollbackTransaction();
        throw new NotFoundException(`One or more tags not found`);
      }
    }

    if (tourData.tourServices && tourData.tourServices.length > 0) {
      const services = await serviceRepository.find();
      const serviceIds = tourData.tourServices.map((s) => s.service.id);
      if (services && !(services.filter((s) => serviceIds.includes(s.id)).length === serviceIds.length)) {
        console.log('I am here!');
        throw new NotFoundException(`One or more services not found`);
      }
    }

    if (!tourData.primaryImages.length) {
      await this.unitOfWork.rollbackTransaction();
      throw new BadRequestException(`Please provide a primary image`);
    }

    // if (!tourData.dailyForms.length) {
    //   await this.unitOfWork.rollbackTransaction();
    //   throw new BadRequestException(`Please provide at least one daily program`);
    // }

    try {
      const tour = new Tour();
      tour.title = tourData.title;
      tour.spot = tourData.spot;
      tour.body = tourData.body;
      tour.tourType = tourData.tourType;
      tour.publishStatus = tourData.publishStatus;
      tour.publishDate = new Date(tourData.publishDate);
      tour.startDate = new Date(tourData.startDate);
      tour.endDate = new Date(tourData.endDate);
      tour.importantNotes = tourData.importantNotes;
      tour.seoLink = await this.seoLinkService.generateUniqueSeoLink(tourData.title, 'tour', tour.id);
      tour.category = category;

      const tagIds = tourData.tags.map((s) => s.id);
      tour.tags = tags.filter((t) => tagIds.includes(t.id));

      const newTourServices: TourServiceEntity[] = [];
      tourData.tourServices = tourData.tourServices.filter((s) => (s.type as ServiceType) !== ServiceType.INHERIT);
      for (let index = 0; index < tourData.tourServices.length; index++) {
        const s = tourData.tourServices[index];
        const tourService = await tourServiceRepository.findOne({ where: { id: s.id } });
        if (tourService) {
          tourService.type = s.type as ServiceType;
          newTourServices.push(tourService);
        } else {
          const newTourService = new TourServiceEntity();
          const service = await serviceRepository.findOne({ where: { id: s.service.id } });
          newTourService.service = service;
          // tourService.tour = newTour;
          newTourService.type = s.type as ServiceType;
          newTourServices.push(newTourService);
        }
      }
      tour.tourServices = newTourServices;

      const tourDates: TourDate[] = [];
      for (let index = 0; index < tourData.dates.length; index++) {
        const d = tourData.dates[index];
        const tourDate = new TourDate();
        tourDate.startDate = new Date(d.startDate);
        tourDate.endDate = new Date(d.endDate);
        tourDate.description = d.description;
        tourDate.isActive = d.isActive;

        const tourPrices: TourPrice[] = [];
        for (let index = 0; index < d.prices.length; index++) {
          const p = d.prices[index];
          const tourPrice = new TourPrice();
          tourPrice.name = p.name;
          tourPrice.currency = p.currency as Currency;
          tourPrice.description = p.description;
          tourPrice.price = Number(p.price);
          // await transactionalEntityManager.save(tourPrice);
          tourPrices.push(tourPrice);
        }
        tourDate.prices = tourPrices;

        tourDates.push(tourDate);
      }
      tour.dates = tourDates;

      // const tourPrices: TourPrice[] = [];
      // for (let index = 0; index < tourData.prices.length; index++) {
      //   const p = tourData.prices[index];
      //   const tourPrice = new TourPrice();
      //   tourPrice.name = p.name;
      //   tourPrice.currency = p.currency as Currency;
      //   tourPrice.description = p.description;
      //   tourPrice.price = Number(p.price);
      //   // await transactionalEntityManager.save(tourPrice);
      //   tourPrices.push(tourPrice);
      // }
      // tour.prices = tourPrices;

      const dailyForms: TourDaily[] = [];

      for (let index = 0; index < tourData.dailyForms.length; index++) {
        const d = tourData.dailyForms[index];
        const newTourDaily = new TourDaily();
        newTourDaily.name = index + 1 + '. Gün';
        console.log({ breakfeast: newTourDaily.breakfeast });
        newTourDaily.breakfeast = d.breakfeast;
        newTourDaily.lunch = d.lunch;
        newTourDaily.dinner = d.dinner;
        newTourDaily.description = d.description;
        newTourDaily.dailyVisitingPlaces = d.dailyVisitingPlaces.map((s) => {
          const dailyVisitingPlace = new TourDailyVisitingPlace();
          dailyVisitingPlace.name = s.name;
          return dailyVisitingPlace;
        });

        const pathIds = d.dailyPaths.map((s) => s.id);
        const dailyPaths = await tourDailyPathRepository.find({ where: { id: In(pathIds) } });
        if (!dailyPaths || dailyPaths.length != pathIds.length) {
          await this.unitOfWork.rollbackTransaction();
          throw new BadRequestException('One or more daily paths not found');
        }
        newTourDaily.dailyPaths = dailyPaths;
        dailyForms.push(newTourDaily);
      }

      tour.dailyForms = dailyForms;

      await this.repository.save(tour);

      //#region Images
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(now.getDate()).padStart(2, '0');
      // const hour = String(now.getHours()).padStart(2, '0');
      // const minute = String(now.getMinutes()).padStart(2, '0');

      const folderDate = `${year}-${month}-${day}`; //_${hour}-${minute};

      if (tourData.primaryImages && tourData.primaryImages.length) {
        const databaseImages = await ImageRepository.find({ where: { primaryForTour: { id: tour.id } } });
        const uploadedImagesIds = tourData.uploadedPrimaryImages.map((s) => s.id);
        const ImageIdsWillBeDeleted = databaseImages.filter((s) => !uploadedImagesIds.includes(s.id)).map((s) => s.id);

        if (ImageIdsWillBeDeleted.length) await ImageRepository.delete(ImageIdsWillBeDeleted);

        const primaryImages: Image[] = [];
        const imageStr = 'data:image/jpeg;base64,' + tourData.primaryImages[0].buffer.toString('base64');
        await v2.uploader
          .upload(imageStr, { folder: `${process.env.NODE_ENV}/tour/${folderDate}/${tour.id}` })
          .then(async (result) => {
            const newImage = new Image();
            newImage.originalName = tourData.primaryImages[0].originalname;
            newImage.publicId = result.public_id;
            newImage.url = result.url;
            newImage.secureUrl = result.secure_url;
            newImage.format = result.format;
            newImage.width = result.width;
            newImage.height = result.height;
            newImage.createdAt = new Date(result.created_at);
            newImage.primaryForTour = tour;
            await ImageRepository.save(newImage);
            primaryImages.push(newImage);

            console.log({ imageUrl: result.url });
          })
          .catch(async (err) => {
            await this.unitOfWork.rollbackTransaction();
            throw new InternalServerErrorException(
              `Something went wrong while uploading ${tourData.primaryImages[0].originalname} to cloudinary`,
            );
          });
      }

      const databaseImages = await ImageRepository.find({ where: { tour: { id: tour.id } } });
      const uploadedImagesIds = tourData.uploadedGalleryImages.map((s) => s.id);
      const ImageIdsWillBeDeleted = databaseImages.filter((s) => !uploadedImagesIds.includes(s.id)).map((s) => s.id);

      if (ImageIdsWillBeDeleted.length) await ImageRepository.delete(ImageIdsWillBeDeleted);

      if (tourData.galleryImages && tourData.galleryImages.length) {
        const galleryImages: Image[] = [];
        for (let index = 0; index < tourData.galleryImages.length; index++) {
          const file = tourData.galleryImages[index];
          console.log({ file });
          const imageStr = 'data:image/jpeg;base64,' + file.buffer.toString('base64');
          await v2.uploader
            .upload(imageStr, { folder: `${process.env.NODE_ENV}/tour/${folderDate}/${tour.id}` })
            .then(async (result) => {
              const newImage = new Image();
              newImage.originalName = file.originalname;
              newImage.publicId = result.public_id;
              newImage.url = result.url;
              newImage.secureUrl = result.secure_url;
              newImage.format = result.format;
              newImage.width = result.width;
              newImage.height = result.height;
              newImage.createdAt = new Date(result.created_at);
              newImage.tour = tour;
              await ImageRepository.save(newImage);
              galleryImages.push(newImage);
              console.log({ imageUrl: result.url });
            })
            .catch(async (err) => {
              await this.unitOfWork.rollbackTransaction();

              throw new InternalServerErrorException(
                `Something went wrong while uploading ${file.originalname} to cloudinary`,
              );
            });
        }
      }
      await this.unitOfWork.commitTransaction();

      return plainToInstance(TourDto, tour, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async updateTour(id: string, tourData: EditTourDto): Promise<TourDto> {
    await this.unitOfWork.startTransaction();

    const tourRepository = await this.unitOfWork.getRepository(Tour);
    const categoryRepository = await this.unitOfWork.getRepository(TourCategory);
    const tagRepository = await this.unitOfWork.getRepository(Tag);
    const serviceRepository = await this.unitOfWork.getRepository(Service);
    const tourServiceRepository = await this.unitOfWork.getRepository(TourServiceEntity);
    const ImageRepository = await this.unitOfWork.getRepository(Image);
    const tourDailyRepository = await this.unitOfWork.getRepository(TourDaily);
    const tourDailyPathRepository = await this.unitOfWork.getRepository(TourDailyPath);
    const tourDateRepository = await this.unitOfWork.getRepository(TourDate);
    const tourPriceRepository = await this.unitOfWork.getRepository(TourPrice);

    const tour = await this.repository.getById(Number(id));
    if (!tour) {
      await this.unitOfWork.rollbackTransaction();
      throw new NotFoundException(`Tour with id:${id} not found`);
    }

    const category = await categoryRepository.findOne({ where: { id: tourData.category.id } });
    if (!category) {
      await this.unitOfWork.rollbackTransaction();
      throw new NotFoundException(`Tour Category with id:${tourData.category.id} not found`);
    }
    const tags = (await tagRepository.find()) as Tag[];
    if (tourData.tags && tourData.tags.length > 0) {
      const tagIds = tourData.tags.map((s) => s.id);
      if (!tags || !(tags.filter((t) => tagIds.includes(t.id)).length === tagIds.length)) {
        await this.unitOfWork.rollbackTransaction();
        throw new NotFoundException(`One or more tags not found`);
      }
    }

    if (tourData.tourServices && tourData.tourServices.length > 0) {
      const services = await serviceRepository.find();
      const serviceIds = tourData.tourServices.map((s) => s.service.id);
      if (services && !(services.filter((s) => serviceIds.includes(s.id)).length === serviceIds.length)) {
        await this.unitOfWork.rollbackTransaction();
        throw new NotFoundException(`One or more services not found`);
      }
    }

    if (!tourData.uploadedPrimaryImages || (!tourData.uploadedPrimaryImages.length && !tourData.primaryImages.length)) {
      await this.unitOfWork.rollbackTransaction();
      throw new BadRequestException(`Please provide a primary image`);
    }

    try {
      tour.title = tourData.title;
      tour.spot = tourData.spot;
      tour.body = tourData.body;
      tour.tourType = tourData.tourType;
      tour.publishStatus = tourData.publishStatus;
      tour.publishDate = new Date(tourData.publishDate);
      tour.startDate = new Date(tourData.startDate);
      tour.endDate = new Date(tourData.endDate);
      tour.seoLink = await this.seoLinkService.generateUniqueSeoLink(tourData.title, 'tour', tour.id);
      tour.importantNotes = tourData.importantNotes;

      tour.category = category;

      const tagIds = tourData.tags.map((s) => s.id);
      tour.tags = tags.filter((t) => tagIds.includes(t.id));

      const newTourServices: TourServiceEntity[] = [];
      tourData.tourServices = tourData.tourServices.filter((s) => (s.type as ServiceType) !== ServiceType.INHERIT);
      for (let index = 0; index < tourData.tourServices.length; index++) {
        const s = tourData.tourServices[index];
        const tourService = await tourServiceRepository.findOne({ where: { id: s.id } });
        if (tourService) {
          tourService.type = s.type as ServiceType;
          newTourServices.push(tourService);
        } else {
          const newTourService = new TourServiceEntity();
          const service = await serviceRepository.findOne({ where: { id: s.service.id } });
          newTourService.service = service;
          // tourService.tour = newTour;
          newTourService.type = s.type as ServiceType;
          newTourServices.push(newTourService);
        }
      }
      tour.tourServices = newTourServices;

      const tourDates: TourDate[] = [];
      const incomingTourDateIds = tourData.dates.filter((s) => s.id > 0).map((s) => s.id);
      const existingTourDates = await tourDateRepository.find({
        where: { tour: { id: Number(id) } },
        relations: ['prices'],
      });
      const tourDateIdsWillBeDeleted: number[] = existingTourDates.length
        ? existingTourDates.filter((s) => !incomingTourDateIds.includes(s.id)).map((s) => s.id)
        : [];
      tourDateIdsWillBeDeleted &&
        tourDateIdsWillBeDeleted.length &&
        (await tourDateRepository.delete(tourDateIdsWillBeDeleted));
      for (let index = 0; index < tourData.dates.length; index++) {
        const d = tourData.dates[index];
        const tourDate = d.id ? existingTourDates.find((s) => s.id == d.id) : new TourDate();

        tourDate.startDate = new Date(d.startDate);
        tourDate.endDate = new Date(d.endDate);
        tourDate.isActive = d.isActive;
        tourDate.description = d.description;

        const incomingTourPriceIds = d.prices.filter((s) => s.id > 0).map((s) => s.id);
        const existingTourPrices = tourDate.prices || [];
        const tourPriceIdsWillBeDeleted: number[] = existingTourPrices
          .filter((s) => !incomingTourPriceIds.includes(s.id))
          .map((s) => s.id);
        tourPriceIdsWillBeDeleted.length && (await tourPriceRepository.delete(tourPriceIdsWillBeDeleted));

        const tourPrices: TourPrice[] = [];
        for (let index = 0; index < d.prices.length; index++) {
          const p = d.prices[index];
          const tourPrice = p.id ? existingTourPrices.find((s) => s.id == p.id) : new TourPrice();
          tourPrice.name = p.name;
          tourPrice.currency = p.currency as Currency;
          tourPrice.description = p.description;
          tourPrice.price = Number(p.price);
          // await transactionalEntityManager.save(tourPrice);
          tourPrices.push(tourPrice);
        }
        tourDate.prices = tourPrices;
        tourDates.push(tourDate);
      }
      tour.dates = tourDates;

      // const tourPrices: TourPrice[] = [];
      // for (let index = 0; index < tourData.prices.length; index++) {
      //   const p = tourData.prices[index];
      //   const tourPrice = new TourPrice();
      //   tourPrice.name = p.name;
      //   tourPrice.currency = p.currency as Currency;
      //   tourPrice.description = p.description;
      //   tourPrice.price = Number(p.price);
      //   // await transactionalEntityManager.save(tourPrice);
      //   tourPrices.push(tourPrice);
      // }
      // tour.prices = tourPrices;

      const dailyForms: TourDaily[] = []; // Array to hold updated or newly created TourDaily entities.

      for (let index = 0; index < tourData.dailyForms.length; index++) {
        const d = tourData.dailyForms[index];

        // Fetch the TourDaily entity by ID or create a new one if it doesn't exist.
        const tourdaily =
          (await tourDailyRepository.findOne({ where: { id: d.id }, relations: ['dailyVisitingPlaces'] })) ||
          new TourDaily();

        // Update tourdaily.dailyVisitingPlaces
        if (!tourdaily.dailyVisitingPlaces) {
          tourdaily.dailyVisitingPlaces = [];
        }
        console.log('*********************');

        // Update properties of TourDaily entity.
        tourdaily.name = index + 1 + '. Gün'; // Assign a name like "1. Gün", "2. Gün", etc.
        tourdaily.breakfeast = d.breakfeast;
        tourdaily.lunch = d.lunch;
        tourdaily.dinner = d.dinner;
        tourdaily.description = d.description;

        const comingVisitingPlaces = d.dailyVisitingPlaces.map((s) => s.name.trim().toLowerCase());
        console.log({ incoming: comingVisitingPlaces });

        // Fetch existing visiting places from the database
        const existingVisitingPlaces = tourdaily.dailyVisitingPlaces;
        console.log({ existing: existingVisitingPlaces });

        // Identify visiting places to delete
        const visitingPlacesToBeDeleted = existingVisitingPlaces.filter(
          (s) => !comingVisitingPlaces.includes(s.name.trim().toLowerCase()),
        );
        console.log({ toBeDeleted: visitingPlacesToBeDeleted });

        // Perform deletion if there are outdated records
        if (visitingPlacesToBeDeleted.length > 0) {
          console.log('Deleting outdated visiting places...');
          // await tourDailyVisitingPlaceRepository.remove(visitingPlacesToBeDeleted);
          tourdaily.dailyVisitingPlaces = tourdaily.dailyVisitingPlaces.filter(
            (s) => !visitingPlacesToBeDeleted.map((ss) => ss.id).includes(s.id),
          );
        }

        // Identify new visiting places to add
        const existingPlacesName = existingVisitingPlaces.map((s) => s.name.trim().toLowerCase());
        let visitingPlacestoBeAdded = d.dailyVisitingPlaces
          .filter((s) => !existingPlacesName.includes(s.name.trim().toLowerCase()))
          .map((s) => {
            const dailyVisitingPlace = new TourDailyVisitingPlace();
            dailyVisitingPlace.name = s.name;
            return dailyVisitingPlace;
          });

        console.log({ toBeAdded: visitingPlacestoBeAdded });

        // Add only new visiting places
        tourdaily.dailyVisitingPlaces.push(...visitingPlacestoBeAdded);

        // Handle daily paths: Validate and assign the paths to the TourDaily entity.
        const pathIds = d.dailyPaths.map((s) => s.id); // Extract incoming path IDs.
        const dailyPaths = await tourDailyPathRepository.find({ where: { id: In(pathIds) } }); // Fetch paths by IDs.

        // Throw an error if any path is missing.
        if (!dailyPaths || dailyPaths.length != pathIds.length) {
          await this.unitOfWork.rollbackTransaction();
          throw new NotFoundException('One or more daily paths not found');
        }

        // Assign the validated paths to the TourDaily entity.
        tourdaily.dailyPaths = dailyPaths;

        // Add the updated or newly created TourDaily entity to the dailyForms array.
        dailyForms.push(tourdaily);
      }

      // Assign the updated daily forms to the tour entity.
      tour.dailyForms = dailyForms;

      // Update the Tour entity in the database.
      await tourRepository.save(tour);

      //#region Images
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(now.getDate()).padStart(2, '0');
      // const hour = String(now.getHours()).padStart(2, '0');
      // const minute = String(now.getMinutes()).padStart(2, '0');

      const folderDate = `${year}-${month}-${day}`; //_${hour}-${minute};

      if (tourData.primaryImages && tourData.primaryImages.length) {
        const databaseImages = await ImageRepository.find({ where: { primaryForTour: { id: tour.id } } });
        const uploadedImagesIds = tourData.uploadedPrimaryImages.map((s) => s.id);
        const ImageIdsWillBeDeleted = databaseImages.filter((s) => !uploadedImagesIds.includes(s.id)).map((s) => s.id);

        if (ImageIdsWillBeDeleted.length) await ImageRepository.delete(ImageIdsWillBeDeleted);

        const primaryImages: Image[] = [];
        const imageStr = 'data:image/jpeg;base64,' + tourData.primaryImages[0].buffer.toString('base64');
        await v2.uploader
          .upload(imageStr, { folder: `${process.env.NODE_ENV}/tour/${folderDate}/${id}` })
          .then(async (result) => {
            const newImage = new Image();
            newImage.originalName = tourData.primaryImages[0].originalname;
            newImage.publicId = result.public_id;
            newImage.url = result.url;
            newImage.secureUrl = result.secure_url;
            newImage.format = result.format;
            newImage.width = result.width;
            newImage.height = result.height;
            newImage.createdAt = new Date(result.created_at);
            newImage.primaryForTour = tour;
            await ImageRepository.save(newImage);
            primaryImages.push(newImage);

            console.log({ imageUrl: result.url });
          })
          .catch(async (err) => {
            await this.unitOfWork.rollbackTransaction();
            throw new InternalServerErrorException(
              `Something went wrong while uploading ${tourData.primaryImages[0].originalname} to cloudinary`,
            );
          });
      }

      const databaseImages = await ImageRepository.find({ where: { tour: { id: tour.id } } });
      const uploadedImagesIds = tourData.uploadedGalleryImages.map((s) => s.id);
      const ImageIdsWillBeDeleted = databaseImages.filter((s) => !uploadedImagesIds.includes(s.id)).map((s) => s.id);

      if (ImageIdsWillBeDeleted.length) await ImageRepository.delete(ImageIdsWillBeDeleted);

      if (tourData.galleryImages && tourData.galleryImages.length) {
        const galleryImages: Image[] = [];
        for (let index = 0; index < tourData.galleryImages.length; index++) {
          const file = tourData.galleryImages[index];
          console.log({ file });
          const imageStr = 'data:image/jpeg;base64,' + file.buffer.toString('base64');
          await v2.uploader
            .upload(imageStr, { folder: `${process.env.NODE_ENV}/tour/${folderDate}/${id}` })
            .then(async (result) => {
              const newImage = new Image();
              newImage.originalName = file.originalname;
              newImage.publicId = result.public_id;
              newImage.url = result.url;
              newImage.secureUrl = result.secure_url;
              newImage.format = result.format;
              newImage.width = result.width;
              newImage.height = result.height;
              newImage.createdAt = new Date(result.created_at);
              newImage.order = index + 1;
              newImage.tour = tour;
              await ImageRepository.save(newImage);
              galleryImages.push(newImage);
              console.log({ imageUrl: result.url });
            })
            .catch(async (err) => {
              await this.unitOfWork.rollbackTransaction();
              throw new InternalServerErrorException(
                `Something went wrong while uploading ${file.originalname} to cloudinary`,
              );
            });
        }
      }

      await this.unitOfWork.commitTransaction();
      return plainToInstance(TourDto, tour, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async deleteTour(id: string): Promise<void> {
    const tour = await this.repository.getById(Number(id));
    if (!tour) throw new NotFoundException(`Tour with id:'${id}' is not found`);
    await this.repository.delete(Number(id));
  }

  public async uploadBodyImage(file: Express.Multer.File): Promise<string> {
    if (file) {
      const imageStr = 'data:image/jpeg;base64,' + file.buffer.toString('base64');
      return await v2.uploader
        .upload(imageStr, { folder: `${process.env.NODE_ENV}/tourBodyImage/` })
        .then((result) => {
          const imageUrl = result.url;
          console.log({ imageUrl });
          return imageUrl;
        })
        .catch((err) => {
          console.log(err);
          throw new InternalServerErrorException(err.message);
        });
    } else {
      throw new BadRequestException('No file provided');
    }
  }
}
