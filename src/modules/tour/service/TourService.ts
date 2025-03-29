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
import { Service } from 'orm/entities/service/Service';
import { TourService as TourServiceEntity } from 'orm/entities/tour/TourService';
import { Currency, ServiceType } from 'shared/utils/enum';
import { TourPrice } from 'orm/entities/tour/TourPrice';
import { Tour } from 'orm/entities/tour/Tour';
import { TourDaily } from 'orm/entities/tour/TourDaily';
import { TourDailyVisitingPlace } from 'orm/entities/tour/TourDailyVisitingPlace';
import { TourDate } from 'orm/entities/tour/TourDate';
import { ISeoLinkService } from 'shared/interfaces/ISeoLinkService';
import { IImageService } from 'shared/interfaces/IImageService';
import { ITourServiceRepository } from 'modules/tourService/interfaces/ITourServiceRepository';
import { ITourDailyPathRepository } from 'modules/tourDailyPath/interfaces/ITourDailyPathRepository';
import { ITourDailyRepository } from '../interfaces/ITourDailyRepository';
import { ITourDateRepository } from '../interfaces/ITourDateRepository';
import { ITourPriceRepository } from '../interfaces/ITourPriceRepository';
import { Transactional } from 'shared/decorators/Transactional';

@injectable()
export class TourService implements ITourService {
  constructor(
    @inject(INTERFACE_TYPE.ITourRepository) private readonly repository: ITourRepository,
    @inject(INTERFACE_TYPE.ITourCategoryRepository) private readonly categoryRepository: ITourCategoryRepository,
    @inject(INTERFACE_TYPE.ITagRepository) private readonly tagRepository: ITagRepository,
    @inject(INTERFACE_TYPE.IServiceRepository) private readonly serviceRepository: IServiceRepository,
    @inject(INTERFACE_TYPE.ITourServiceRepository) private readonly tourServiceRepository: ITourServiceRepository,
    @inject(INTERFACE_TYPE.ITourDailyPathRepository) private readonly tourDailyPathRepository: ITourDailyPathRepository,
    @inject(INTERFACE_TYPE.ITourDailyRepository) private readonly tourDailyRepository: ITourDailyRepository,
    @inject(INTERFACE_TYPE.ITourDateRepository) private readonly tourDateRepository: ITourDateRepository,
    @inject(INTERFACE_TYPE.ITourPriceRepository) private readonly tourPriceRepository: ITourPriceRepository,
    @inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork,
    @inject(INTERFACE_TYPE.ISeoLinkService) private readonly seoLinkService: ISeoLinkService,
    @inject(INTERFACE_TYPE.IImageService) private readonly imageService: IImageService,

  ) { }

  public async getAll(): Promise<TourListDto[]> {
    const tours = await this.repository.getAll(['tags', 'tourDates', 'category', 'tourServices', 'primaryImages']);
    if (tours && tours.length)
      return plainToInstance(TourListDto, tours, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    return [];
  }

  public async getById(id: string): Promise<TourDto> {
    const tour = await this.repository.getById(Number(id), [
      "category",
      "tags",
      "tourDates",
      "tourDates.prices",
      "tourServices",
      "tourServices.service",
      "dailyForms",
      "dailyForms.dailyPaths",
      "dailyForms.dailyVisitingPlaces",
      "galleryImages",
      "primaryImages"
    ]);
    if (!tour) throw new NotFoundException(`tour_id_not_found`, { id });
    console.log({ tour: tour })
    return plainToInstance(TourDto, tour, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async getBySeoLink(seoLink: string): Promise<TourDto> {
    const tour = await this.repository.getBySeoLink(seoLink);
    if (!tour) throw new NotFoundException(`tour_seoLink_not_found`, { seoLink });
    return plainToInstance(TourDto, tour, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  @Transactional()
  public async createTour(tourData: CreateTourDto): Promise<TourDto> {

    const category = await this.categoryRepository.getById(tourData.category.id);
    if (!category) {
      throw new NotFoundException(`category_not_found`, { id: tourData.category.id });
    }

    let tags: Tag[] | undefined;
    if (tourData.tags && Array.isArray(tourData.tags) && tourData.tags.length > 0) {
      tags = await this.tagRepository.findByIds(tourData.tags.map((t) => t.id));

      if (tags.length !== tourData.tags.length) {
        throw new NotFoundException("tags_not_found");
      }
    }

    let tourServices: Service[] | undefined;
    if (tourData.tourServices && Array.isArray(tourData.tourServices) && tourData.tourServices.length > 0) {
      tourServices = await this.serviceRepository.findByIds(tourData.tourServices.map((t) => t.service.id));
      if (tourServices.length !== tourData.tourServices.length) {
        throw new NotFoundException("services_not_found");
      }
    }

    if (!tourData.primaryImages.length) {
      throw new BadRequestException(`primary_image_required`);
    }

    try {
      let tour = new Tour();
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
        const newTourService = new TourServiceEntity();
        const service = await this.serviceRepository.getById(s.service.id);
        if (service) {
          newTourService.service = service;
          newTourService.type = s.type as ServiceType;
          newTourServices.push(newTourService);
        }
      }
      tour.tourServices = newTourServices;

      const tourDates: TourDate[] = [];
      for (let index = 0; index < tourData.tourDates.length; index++) {
        const d = tourData.tourDates[index];
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
      tour.tourDates = tourDates;

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
        const dailyPaths = await this.tourDailyPathRepository.findByIds(pathIds);
        if (!dailyPaths || dailyPaths.length != pathIds.length) {
          throw new BadRequestException('daily_paths_not_found');
        }
        newTourDaily.dailyPaths = dailyPaths;
        dailyForms.push(newTourDaily);
      }

      tour.dailyForms = dailyForms;

      tour = await this.repository.create(tour);

      //#region Images
      const primaryImages = await this.imageService.saveImages(
        'tour',
        tour.id,
        tourData.primaryImages,
        [],
        'primaryForTour'
      );

      tour.primaryImages = primaryImages

      const galleryImages = await this.imageService.saveImages(
        'tour',
        tour.id,
        tourData.galleryImages,
        [],
        'tour'
      );

      tour.galleryImages = galleryImages

      return plainToInstance(TourDto, tour, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("internal_server_error", { error: error.message });
    }
  }

  @Transactional()
  public async updateTour(id: string, tourData: EditTourDto): Promise<TourDto> {

    const tour = await this.repository.getById(Number(id));
    if (!tour) {
      throw new NotFoundException(`tour_id_not_found`, { id });
    }

    const category = await this.categoryRepository.getById(tourData.category.id);
    if (!category) {
      throw new NotFoundException(`category_not_found`, { id: tourData.category.id });
    }

    let tags: Tag[] | undefined;
    if (tourData.tags && Array.isArray(tourData.tags) && tourData.tags.length > 0) {
      tags = await this.tagRepository.findByIds(tourData.tags.map((t) => t.id));

      if (tags.length !== tourData.tags.length) {
        throw new NotFoundException("tags_not_found");
      }
    }

    let tourServices: Service[] | undefined;
    if (tourData.tourServices && Array.isArray(tourData.tourServices) && tourData.tourServices.length > 0) {
      tourServices = await this.serviceRepository.findByIds(tourData.tourServices.map((t) => t.service.id));
      if (tourServices.length !== tourData.tourServices.length) {
        throw new NotFoundException("services_not_found");
      }
    }

    if (!tourData.uploadedPrimaryImages || (!tourData.uploadedPrimaryImages.length && !tourData.primaryImages.length)) {
      throw new BadRequestException(`primary_image_required`);
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

      const filteredTourServices = tourData.tourServices.filter(
        (s) => s.type !== ServiceType.INHERIT
      );

      const newTourServices = await Promise.all(
        filteredTourServices.map(async (s) => {
          const tourService = await this.tourServiceRepository.getById(s.id);

          if (tourService) {
            tourService.type = s.type as ServiceType;
            return tourService;
          }

          const service = await this.serviceRepository.getById(s.service.id);

          return Object.assign(new TourServiceEntity(), {
            service,
            type: s.type as ServiceType,
          });
        })
      );

      tour.tourServices = newTourServices;


      const incomingTourDateIds = tourData.tourDates.filter(d => d.id > 0).map(d => d.id);
      // Mevcut tarihleri ve ilişkili fiyatları getir
      console.log({ incomingTourDateIds })
      const existingTourDates = await this.tourDateRepository.getByIds(incomingTourDateIds, ['prices']) || [];
      console.log("I am here")
      // Silinmesi gereken tarihleri belirle
      const tourDateIdsWillBeDeleted = existingTourDates
        .filter(d => !incomingTourDateIds.includes(d.id))
        .map(d => d.id);

      // Silme işlemi
      if (tourDateIdsWillBeDeleted.length) {
        await this.tourDateRepository.deleteMultiple(tourDateIdsWillBeDeleted);
      }

      // Yeni ve güncellenmiş tarihleri işle
      const tourDates = await Promise.all(
        tourData.tourDates.map(async d => {
          const tourDate = d.id ? existingTourDates.find(s => s.id === d.id) ?? new TourDate() : new TourDate();

          Object.assign(tourDate, {
            startDate: new Date(d.startDate),
            endDate: new Date(d.endDate),
            isActive: d.isActive,
            description: d.description,
          });

          // Mevcut fiyatları al ve güncellenecekleri belirle
          const incomingTourPriceIds = d.prices.filter(p => p.id > 0).map(p => p.id);
          const existingTourPrices = tourDate.prices || [];
          const tourPriceIdsWillBeDeleted = existingTourPrices
            .filter(p => !incomingTourPriceIds.includes(p.id))
            .map(p => p.id);

          if (tourPriceIdsWillBeDeleted.length) {
            await this.tourPriceRepository.deleteMultiple(tourPriceIdsWillBeDeleted);
          }

          // Yeni fiyatları oluştur
          tourDate.prices = d.prices.map(p => {
            const tourPrice = p.id ? existingTourPrices.find(s => s.id === p.id) ?? new TourPrice() : new TourPrice();
            return Object.assign(tourPrice, {
              name: p.name,
              currency: p.currency as Currency,
              description: p.description,
              price: Number(p.price),
            });
          });

          return tourDate;
        })
      );

      tour.tourDates = tourDates;


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
        // const tourdaily =
        //   (await tourDailyRepository.findOne({ where: { id: d.id }, relations: ['dailyVisitingPlaces'] })) ||
        //   new TourDaily();

        const tourDaily = await this.tourDailyRepository.getById(d.id, ['dailyVisitingPlaces']) || new TourDaily()

        // Update tourdaily.dailyVisitingPlaces
        if (!tourDaily.dailyVisitingPlaces) {
          tourDaily.dailyVisitingPlaces = [];
        }
        console.log('*********************');

        // Update properties of TourDaily entity.
        tourDaily.name = index + 1 + '. Gün'; // Assign a name like "1. Gün", "2. Gün", etc.
        tourDaily.breakfeast = d.breakfeast;
        tourDaily.lunch = d.lunch;
        tourDaily.dinner = d.dinner;
        tourDaily.description = d.description;

        const comingVisitingPlaces = d.dailyVisitingPlaces.map((s) => s.name.trim().toLowerCase());
        console.log({ incoming: comingVisitingPlaces });

        // Fetch existing visiting places from the database
        const existingVisitingPlaces = tourDaily.dailyVisitingPlaces;
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
          tourDaily.dailyVisitingPlaces = tourDaily.dailyVisitingPlaces.filter(
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
        tourDaily.dailyVisitingPlaces.push(...visitingPlacestoBeAdded);

        // Handle daily paths: Validate and assign the paths to the TourDaily entity.
        // Extract incoming path IDs and validate
        const pathIds = d.dailyPaths.map((s) => s.id);
        if (pathIds.length === 0) {
          throw new BadRequestException('no_daily_paths_provided');
        }
        const dailyPaths = await this.tourDailyPathRepository.getByIds(pathIds); // Fetch paths by IDs.

        // Throw an error if any path is missing.
        if (!dailyPaths || dailyPaths.length != pathIds.length) {
          throw new NotFoundException('daily_paths_not_found');
        }

        // Assign the validated paths to the TourDaily entity.
        tourDaily.dailyPaths = dailyPaths;

        // Add the updated or newly created TourDaily entity to the dailyForms array.
        dailyForms.push(tourDaily);
      }

      // Assign the updated daily forms to the tour entity.
      tour.dailyForms = dailyForms;

      // Update the Tour entity in the database.
      await this.repository.save(Number(id), tour);

      //#region Images

      const primaryImages = await this.imageService.saveImages(
        'tour',
        tour.id,
        tourData.primaryImages,
        tourData.uploadedPrimaryImages.map(s => s.id),
        'primaryForTour'
      );

      tour.primaryImages = primaryImages

      const galleryImages = await this.imageService.saveImages(
        'tour',
        tour.id,
        tourData.galleryImages,
        tourData.uploadedGalleryImages.map(s => s.id),
        'tour'
      );

      tour.galleryImages = galleryImages

      return plainToInstance(TourDto, tour, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("internal_server_error", {error: error.message});
    }
  }

  public async deleteTour(id: string): Promise<void> {
    const tour = await this.repository.getById(Number(id));
    if (!tour) throw new NotFoundException(`tour_id_not_found`, { id });
    await this.repository.delete(Number(id));
  }

  public async uploadBodyImage(file: Express.Multer.File): Promise<string> {
    if (file) {
      return await this.imageService.uploadBodyImage("tourBodyImage", file)
    } else {
      throw new BadRequestException('no_file_provided');
    }
  }
}
