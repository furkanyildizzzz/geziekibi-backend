import { inject, injectable } from 'inversify';
import { IHomepageSliderService } from '../interfaces/IHomepageSliderService';
import { INTERFACE_TYPE } from 'core/types';
import { IHomepageSliderRepository } from '../interfaces/IHomepageSliderRepository';
import { CreateHomepageSliderDto } from '../dto/CreateHomepageSliderDto';
import { HomepageSliderSuccessDto } from '../dto/HomepageSliderSuccessDto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { BadRequestException, InternalServerErrorException, NotFoundException } from 'shared/errors/allException';
import { HomepageSlider } from 'orm/entities/homepageSlider/HomepageSlider';
import { Image } from 'orm/entities/image/Image';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { v2 } from 'cloudinary';
import { ISeoLinkService } from 'shared/interfaces/ISeoLinkService';
import { ImageService } from 'shared/services/ImageService';

@injectable()
export class HomepageSliderService implements IHomepageSliderService {
  constructor(
    @inject(INTERFACE_TYPE.IHomepageSliderRepository) private readonly repository: IHomepageSliderRepository,
    @inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork,
    @inject(INTERFACE_TYPE.IImageService) private readonly imageService: ImageService
  ) { }

  public async getAll(): Promise<HomepageSliderSuccessDto[]> {
    const tourCategories = await this.repository.getAll(['image']);
    if (tourCategories && tourCategories.length)
      return plainToInstance(HomepageSliderSuccessDto, tourCategories, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    return [];
  }

  public async getById(id: string): Promise<HomepageSliderSuccessDto> {
    const homepageSlider = await this.repository.getById(Number(id),['image']);
    if (!homepageSlider) throw new NotFoundException(`Homepage Slider with id:${id} not found`);
    return plainToInstance(HomepageSliderSuccessDto, homepageSlider, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async createHomepageSlider(
    homepageSliderData: CreateHomepageSliderDto,
    files: Express.Multer.File[],
  ): Promise<HomepageSliderSuccessDto> {
    try {

      if (!files || !files['homepageSlider'] || !files['homepageSlider'].length) {
        throw new BadRequestException(`Please provide an image`);
      }

      let newHomepageSlider = new HomepageSlider();
      newHomepageSlider.order = homepageSliderData.order;
      newHomepageSlider.isActive = homepageSliderData.isActive;
      newHomepageSlider = await this.repository.create(newHomepageSlider);

      //#region Images
      const image = await this.imageService.saveImages("homepageSlider", newHomepageSlider.id, files['homepageSlider'], [], "homepageSlider")

      newHomepageSlider.image = image[0]

      // const ImageRepository = await this.unitOfWork.getRepository(Image);
      // if (files && files['homepageSlider'] && files['homepageSlider'].length) {
      //   const newImage = new Image();
      //   const imageStr = 'data:image/jpeg;base64,' + files['homepageSlider'][0].buffer.toString('base64');
      //   await v2.uploader
      //     .upload(imageStr, { folder: `${process.env.NODE_ENV}/homepageSlider/` })
      //     .then(async (result) => {
      //       newImage.publicId = result.public_id;
      //       newImage.url = result.url;
      //       newImage.secureUrl = result.secure_url;
      //       newImage.format = result.format;
      //       newImage.width = result.width;
      //       newImage.height = result.height;
      //       newImage.createdAt = new Date(result.created_at);
      //       newImage.homepageSlider = newHomepageSlider;
      //       await ImageRepository.save(newImage);
      //       newHomepageSlider.image = newImage;
      //       return plainToInstance(Image, newImage, {
      //         excludeExtraneousValues: true,
      //         enableCircularCheck: true,
      //       });
      //     })
      //     .catch((error) => {
      //       throw new InternalServerErrorException(error.message);
      //     });
      // } else {
      //   throw new BadRequestException(`Please provide an image`);
      // }

      return plainToInstance(HomepageSliderSuccessDto, newHomepageSlider, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  public async updateHomepageSlider(
    id: string,
    homepageSliderData: CreateHomepageSliderDto,
    files: Express.Multer.File[],
  ): Promise<HomepageSliderSuccessDto> {
    try {
      const homepageSlider = await this.repository.getById(Number(id));
      if (!homepageSlider) throw new NotFoundException(`Homepage Slider with id:'${id}' is not found`);
      console.log(homepageSlider);
      console.log(homepageSliderData.isActive);
      homepageSlider.order = homepageSliderData.order ?? homepageSlider.order; // Use existing value if undefined
      homepageSlider.isActive = homepageSliderData.isActive ?? homepageSlider.isActive;
      console.log(homepageSlider);

      await this.repository.save(Number(id), homepageSlider);

      // //#region Images
      // const ImageRepository = await this.unitOfWork.getRepository(Image);
      // if (files && files['homepageSlider'] && files['homepageSlider'].length) {
      //   const newImage = new Image();
      //   const imageStr = 'data:image/jpeg;base64,' + files['homepageSlider'][0].buffer.toString('base64');
      //   await v2.uploader
      //     .upload(imageStr, { folder: `${process.env.NODE_ENV}/homepageSlider/` })
      //     .then(async (result) => {
      //       newImage.publicId = result.public_id;
      //       newImage.url = result.url;
      //       newImage.secureUrl = result.secure_url;
      //       newImage.format = result.format;
      //       newImage.width = result.width;
      //       newImage.height = result.height;
      //       newImage.createdAt = new Date(result.created_at);

      //       return plainToInstance(Image, newImage, {
      //         excludeExtraneousValues: true,
      //         enableCircularCheck: true,
      //       });
      //     })
      //     .catch((error) => {
      //       throw new InternalServerErrorException(error.message);
      //     });
      //   homepageSlider.image = newImage;
      //   await this.repository.update(Number(id), homepageSlider);
      // } else {
      //   throw new BadRequestException(`Please provide an image`);
      // }

      return plainToInstance(HomepageSliderSuccessDto, homepageSlider, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }
  public async deleteHomepageSlider(id: string): Promise<void> {
    const homepageSlider = await this.repository.getById(Number(id));
    if (!homepageSlider) throw new NotFoundException(`Homepage Slider with id:'${id}' is not found`);
    await this.repository.delete(Number(id));
  }
}
