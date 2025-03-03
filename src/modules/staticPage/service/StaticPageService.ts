import { inject, injectable } from 'inversify';
import { IStaticPageService } from '../interfaces/IStaticPageService';
import { INTERFACE_TYPE } from 'core/types';
import { IStaticPageRepository } from '../interfaces/IStaticPageRepository';
import { CreateStaticPageDto } from '../dto/CreateStaticPageDto';
import { StaticPageListDto } from '../dto/StaticPageListDto';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, InternalServerErrorException, NotFoundException } from 'shared/errors/allException';
import { StaticPageDto } from '../dto/StaticPageDto';
import { Tag } from 'orm/entities/tag/Tag';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { v2 } from 'cloudinary';
import { Image } from 'orm/entities/image/Image';
import { StaticPageType } from 'shared/utils/enum';
import { StaticPage } from 'orm/entities/static-page/StaticPage';
import { ImageService } from 'shared/services/ImageService';

@injectable()
export class StaticPageService implements IStaticPageService {
  constructor(
    @inject(INTERFACE_TYPE.IStaticPageRepository) private readonly repository: IStaticPageRepository,
    @inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork,
    @inject(INTERFACE_TYPE.IImageService) private readonly imageService: ImageService,
  ) {}

  public async getAll(): Promise<StaticPageListDto[]> {
    const staticPages = await this.repository.getAll();
    if (staticPages && staticPages.length)
      return plainToInstance(StaticPageListDto, staticPages, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    return [];
  }

  public async getById(id: string): Promise<StaticPageDto> {
    const staticPage = await this.repository.getById(Number(id));
    if (!staticPage) throw new NotFoundException(`StaticPage with id:${id} not found`);
    return plainToInstance(StaticPageDto, staticPage, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async getByPageType(pageType: StaticPageType): Promise<StaticPageDto> {
    const staticPage = await this.repository.getByType(pageType);
    if (!staticPage) throw new NotFoundException(`StaticPage with type:${pageType} not found`);
    return plainToInstance(StaticPageDto, staticPage, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async createStaticPage(staticPageData: CreateStaticPageDto): Promise<StaticPageDto> {
    try {
      const staticPage = new StaticPage();
      staticPage.title = staticPageData.title;
      staticPage.body = staticPageData.body;
      staticPage.pageType = staticPageData.pageType;

      await this.repository.create(staticPage);

      return plainToInstance(StaticPageDto, staticPage, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async updateStaticPage(id: string, staticPageData: CreateStaticPageDto): Promise<StaticPageDto> {
    const staticPage = await this.repository.getById(Number(id));
    if (!staticPage) throw new NotFoundException(`StaticPage with id:${id} not found`);

    try {
      staticPage.title = staticPageData.title;
      staticPage.body = staticPageData.body;
      staticPage.pageType = staticPageData.pageType;

      // Update the StaticPage entity in the database.
      await this.repository.update(Number(id), staticPage);

      return plainToInstance(StaticPageDto, staticPage, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async deleteStaticPage(id: string): Promise<void> {
    const staticPage = await this.repository.getById(Number(id));
    if (!staticPage) throw new NotFoundException(`StaticPage with id:'${id}' is not found`);
    await this.repository.delete(Number(id));
  }

  public async uploadBodyImage(file: Express.Multer.File): Promise<string> {
    // if (file) {
    //   const imageStr = 'data:image/jpeg;base64,' + file.buffer.toString('base64');
    //   return await v2.uploader
    //     .upload(imageStr, { folder: `${process.env.NODE_ENV}/staticPageBodyImage/` })
    //     .then((result) => {
    //       const imageUrl = result.url;
    //       console.log({ imageUrl });
    //       return imageUrl;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       throw new InternalServerErrorException(err.message);
    //     });
    // } else {
    //   throw new BadRequestException('No file provided');
    // }
    if (file) {
      return await this.imageService.uploadBodyImage("staticPageBodyImage", file)
    } else {
      throw new BadRequestException('No file provided');
    }
  }
  
}
