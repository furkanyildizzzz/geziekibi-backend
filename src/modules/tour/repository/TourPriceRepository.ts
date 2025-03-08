import { inject, injectable } from 'inversify';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { TourPrice } from 'orm/entities/tour/TourPrice';
import { BaseRepository } from 'shared/repositories/BaseRepository';
import { ITourPriceRepository } from '../interfaces/ITourPriceRepository';

@injectable()
export class TourPriceRepository extends BaseRepository<TourPrice> implements ITourPriceRepository {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) unitOfWork: UnitOfWork) {
    super(unitOfWork, TourPrice)
  }

  
}
