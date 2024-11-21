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
import TourServiceEntity from 'orm/entities/tour/TourService';
import { Repository } from 'typeorm';
import { Currency, ServiceType } from 'shared/utils/enum';
import { TourPrice } from 'orm/entities/tour/TourPrice';
import { v2 } from 'cloudinary';
import { Image } from 'orm/entities/image/Image';
import { Tour } from 'orm/entities/tour/Tour';

@injectable()
export class TourService implements ITourService {
  constructor(
    @inject(INTERFACE_TYPE.ITourRepository) private readonly repository: ITourRepository,
    @inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork,
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

  public async createTour(tourData: CreateTourDto): Promise<TourDto> {
    const categoryRepository = await this.unitOfWork.getRepository(TourCategory);
    const tagRepository = await this.unitOfWork.getRepository(Tag);
    const serviceRepository = await this.unitOfWork.getRepository(Service);
    const tourServiceRepository = await this.unitOfWork.getRepository(TourServiceEntity);
    const ImageRepository = await this.unitOfWork.getRepository(Image);

    const category = await categoryRepository.findOne({ where: { id: tourData.category.id } });
    if (!category) throw new NotFoundException(`Tour Category with id:${tourData.category.id} not found`);

    const tags = (await tagRepository.find()) as Tag[];
    if (tourData.tags && tourData.tags.length > 0) {
      const tagIds = tourData.tags.map((s) => s.id);
      if (!tags || !(tags.filter((t) => tagIds.includes(t.id)).length === tagIds.length))
        throw new NotFoundException(`One or more tags not found`);
    }

    if (tourData.tourServices && tourData.tourServices.length > 0) {
      const services = await serviceRepository.find();
      const serviceIds = tourData.tourServices.map((s) => s.service.id);
      if (services && !(services.filter((s) => serviceIds.includes(s.id)).length === serviceIds.length))
        throw new NotFoundException(`One or more services not found`);
    }

    if (!tourData.uploadedPrimaryImages.length && !tourData.primaryImages.length) {
      throw new BadRequestException(`Please provide a primary image`);
    }

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

      const tourPrices: TourPrice[] = [];
      for (let index = 0; index < tourData.prices.length; index++) {
        const p = tourData.prices[index];
        const tourPrice = new TourPrice();
        tourPrice.name = p.name;
        tourPrice.currency = p.currency as Currency;
        tourPrice.description = p.description;
        tourPrice.price = Number(p.price);
        // await transactionalEntityManager.save(tourPrice);
        tourPrices.push(tourPrice);
      }
      tour.prices = tourPrices;

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
          .upload(imageStr, { folder: 'tour/' + folderDate + '/' + tour.id })
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
          .catch((err) => {
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
            .upload(imageStr, { folder: 'tour/' + folderDate + '/' + tour.id })
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
            .catch((err) => {
              throw new InternalServerErrorException(
                `Something went wrong while uploading ${file.originalname} to cloudinary`,
              );
            });
        }
      }

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
    const categoryRepository = await this.unitOfWork.getRepository(TourCategory);
    const tagRepository = await this.unitOfWork.getRepository(Tag);
    const serviceRepository = await this.unitOfWork.getRepository(Service);
    const tourServiceRepository = await this.unitOfWork.getRepository(TourServiceEntity);
    const ImageRepository = await this.unitOfWork.getRepository(Image);

    const tour = await this.repository.getById(Number(id));
    if (!tour) throw new NotFoundException(`Tour with id:${id} not found`);

    const category = await categoryRepository.findOne({ where: { id: tourData.category.id } });
    if (!category) throw new NotFoundException(`Tour Category with id:${tourData.category.id} not found`);

    const tags = (await tagRepository.find()) as Tag[];
    if (tourData.tags && tourData.tags.length > 0) {
      const tagIds = tourData.tags.map((s) => s.id);
      if (!tags || !(tags.filter((t) => tagIds.includes(t.id)).length === tagIds.length))
        throw new NotFoundException(`One or more tags not found`);
    }

    if (tourData.tourServices && tourData.tourServices.length > 0) {
      const services = await serviceRepository.find();
      const serviceIds = tourData.tourServices.map((s) => s.service.id);
      if (services && !(services.filter((s) => serviceIds.includes(s.id)).length === serviceIds.length))
        throw new NotFoundException(`One or more services not found`);
    }

    if (!tourData.uploadedPrimaryImages.length && !tourData.primaryImages.length) {
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

      const tourPrices: TourPrice[] = [];
      for (let index = 0; index < tourData.prices.length; index++) {
        const p = tourData.prices[index];
        const tourPrice = new TourPrice();
        tourPrice.name = p.name;
        tourPrice.currency = p.currency as Currency;
        tourPrice.description = p.description;
        tourPrice.price = Number(p.price);
        // await transactionalEntityManager.save(tourPrice);
        tourPrices.push(tourPrice);
      }
      tour.prices = tourPrices;

      await this.repository.update(Number(id), tour);

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
          .upload(imageStr, { folder: 'tour/' + folderDate + '/' + id })
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
          .catch((err) => {
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
            .upload(imageStr, { folder: 'tour/' + folderDate + '/' + id })
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
            .catch((err) => {
              throw new InternalServerErrorException(
                `Something went wrong while uploading ${file.originalname} to cloudinary`,
              );
            });
        }
      }

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
}
