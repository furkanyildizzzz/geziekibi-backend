import { inject, injectable } from 'inversify';
import { ITourServiceWeb } from '../interfaces/ITourServiceWeb';
import { INTERFACE_TYPE } from 'core/types';
import { ITourRepositoryWeb } from '../interfaces/ITourRepositoryWeb';
import { TourListDtoWeb } from '../dto/TourListDtoWeb';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, InternalServerErrorException, NotFoundException } from 'shared/errors/allException';
import { TourDtoWeb } from '../dto/TourDtoWeb';
import { ITourCategoryRepository } from 'modules/tourCategory/interfaces/ITourCategoryRepository';
import { ITagRepository } from 'modules/tag/interfaces/ITagRepository';
import { IServiceRepository } from 'modules/service/interfaces/IServiceRepository';
import { Tag } from 'orm/entities/tag/Tag';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { Service } from 'orm/entities/service/Service';
import TourServiceEntity from 'orm/entities/tour/TourService';
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
import tourFunctions from 'shared/utils/tourFunctions';

@injectable()
export class TourServiceWeb implements ITourServiceWeb {
  constructor(
    @inject(INTERFACE_TYPE.ITourRepositoryWeb) private readonly repository: ITourRepositoryWeb,
    @inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork,
    @inject(INTERFACE_TYPE.ISeoLinkService) private readonly seoLinkService: ISeoLinkService,
  ) {}

  public async getAll(): Promise<TourListDtoWeb[]> {
    const tours = await this.repository.getAll();
    if (tours && tours.length)
      return plainToInstance(TourListDtoWeb, tours, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    return [];
  }
  public async getBySeoLink(seoLink: string): Promise<TourDtoWeb> {
    const tour = await this.repository.getBySeoLink(seoLink);
    if (!tour) throw new NotFoundException(`Tour with seoLink:${seoLink} not found`);
    const { days, nights } = tourFunctions.calculateDaysAndNights(tour.startDate, tour.endDate);
    const daysAndNights = `${nights} gece/${days} gün`;

    return plainToInstance(
      TourDtoWeb,
      { ...tour, daysAndNights },
      {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      },
    );
  }
}
