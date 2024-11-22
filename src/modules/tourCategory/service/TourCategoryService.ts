import { inject, injectable } from 'inversify';
import { ITourCategoryService } from '../interfaces/ITourCategoryService';
import { INTERFACE_TYPE } from 'core/types';
import { ITourCategoryRepository } from '../interfaces/ITourCategoryRepository';
import { CreateTourCategoryDto } from '../dto/CreateTourCategoryDto';
import { TourCategorySuccessDto } from '../dto/TourCategorySuccessDto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { BadRequestException, InternalServerErrorException, NotFoundException } from 'shared/errors/allException';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { Image } from 'orm/entities/image/Image';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { v2 } from 'cloudinary';

@injectable()
export class TourCategoryService implements ITourCategoryService {
  constructor(
    @inject(INTERFACE_TYPE.ITourCategoryRepository) private readonly repository: ITourCategoryRepository,
    @inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork,
  ) {}

  public async getAll(): Promise<TourCategorySuccessDto[]> {
    const tourCategories = await this.repository.getAll();
    if (tourCategories && tourCategories.length)
      return plainToInstance(TourCategorySuccessDto, tourCategories, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    return [];
  }

  public async getById(id: string): Promise<TourCategorySuccessDto> {
    const tourCategory = await this.repository.getById(Number(id));
    if (!tourCategory) throw new NotFoundException(`Tour Category with id:${id} not found`);
    return plainToInstance(TourCategorySuccessDto, tourCategory, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }
  public async createTourCategory(tourCategoryData: CreateTourCategoryDto): Promise<TourCategorySuccessDto> {
    console.log({ parentId: tourCategoryData.parentId });
    const newTourCategory = new TourCategory();
    const tourCategory = await this.repository.getByName(tourCategoryData.name);
    if (tourCategory) throw new BadRequestException(`Tour Category '${tourCategoryData.name}' is already exists`);
    newTourCategory.name = tourCategoryData.name;

    if (tourCategoryData.parentId > 0) {
      const parentTourCategory = await this.repository.getById(tourCategoryData.parentId);
      if (!parentTourCategory)
        throw new NotFoundException(`Parent Tour Category with id:${tourCategoryData.parentId} not found`);
      newTourCategory.parent = parentTourCategory;
    }

    newTourCategory.description = tourCategoryData.description;
    await this.repository.create(newTourCategory);
    return plainToInstance(TourCategorySuccessDto, tourCategory, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }
  public async updateTourCategory(
    id: string,
    tourCategoryData: CreateTourCategoryDto,
  ): Promise<TourCategorySuccessDto> {
    try {
      const tourCategory = await this.repository.getById(Number(id));
      if (!tourCategory) throw new NotFoundException(`Tour Category with id:'${id}' is not found`);

      if (tourCategory.name !== tourCategoryData.name) {
        const tourCategoryByName = await this.repository.getByName(tourCategoryData.name);
        if (tourCategoryByName)
          throw new BadRequestException(`Tour Category '${tourCategoryData.name}' is already exists`);
      }
      tourCategory.name = tourCategoryData.name;

      if (tourCategoryData.parentId) {
        const parentTourCategory = await this.repository.getById(tourCategoryData.parentId);
        if (!parentTourCategory)
          throw new NotFoundException(`Parent Tour Category with id:${tourCategoryData.parentId} not found`);
        tourCategory.parent = parentTourCategory;
      } else {
        tourCategory.parent = null;
      }

      if (!tourCategoryData.uploadedPrimaryImages.length && !tourCategoryData.primaryImages.length) {
        throw new BadRequestException(`Please provide a primary image`);
      }
      tourCategory.description = tourCategoryData.description;

      await this.repository.update(Number(id), tourCategory);

      //#region Images
      const ImageRepository = await this.unitOfWork.getRepository(Image);
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(now.getDate()).padStart(2, '0');
      // const hour = String(now.getHours()).padStart(2, '0');
      // const minute = String(now.getMinutes()).padStart(2, '0');

      const folderDate = `${year}-${month}-${day}`; //_${hour}-${minute};

      if (tourCategoryData.primaryImages && tourCategoryData.primaryImages.length) {
        const databaseImages = await ImageRepository.find({ where: { category: { id: tourCategory.id } } });
        console.log({ databaseImages });
        const uploadedImagesIds = tourCategoryData.uploadedPrimaryImages.map((s) => s.id);
        console.log({ uploadedImagesIds });
        const ImageIdsWillBeDeleted = databaseImages.filter((s) => !uploadedImagesIds.includes(s.id)).map((s) => s.id);
        console.log({ ImageIdsWillBeDeleted });
        if (ImageIdsWillBeDeleted.length) await ImageRepository.delete(ImageIdsWillBeDeleted);

        const primaryImages: Image[] = [];
        const imageStr = 'data:image/jpeg;base64,' + tourCategoryData.primaryImages[0].buffer.toString('base64');
        await v2.uploader
          .upload(imageStr, { folder: `${process.env.NODE_ENV}/category/${folderDate}/${id}` })
          .then(async (result) => {
            const newImage = new Image();
            newImage.originalName = tourCategoryData.primaryImages[0].originalname;
            newImage.publicId = result.public_id;
            newImage.url = result.url;
            newImage.secureUrl = result.secure_url;
            newImage.format = result.format;
            newImage.width = result.width;
            newImage.height = result.height;
            newImage.createdAt = new Date(result.created_at);
            newImage.category = tourCategory;
            await ImageRepository.save(newImage);
            primaryImages.push(newImage);

            console.log({ imageUrl: result.url });
          })
          .catch((err) => {
            throw new InternalServerErrorException(
              `Something went wrong while uploading ${tourCategoryData.primaryImages[0].originalname} to cloudinary`,
            );
          });
      }

      return plainToInstance(TourCategorySuccessDto, tourCategory, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }
  public async deleteTourCategory(id: string): Promise<void> {
    const tourCategory = await this.repository.getById(Number(id));
    if (!tourCategory) throw new NotFoundException(`Tour Category with id:'${id}' is not found`);
    await this.repository.delete(Number(id));
  }
}
