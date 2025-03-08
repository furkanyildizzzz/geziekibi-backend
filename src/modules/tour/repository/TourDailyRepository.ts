import { inject, injectable } from 'inversify';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { TourDaily } from 'orm/entities/tour/TourDaily';
import { BaseRepository } from 'shared/repositories/BaseRepository';
import { ITourDailyRepository } from '../interfaces/ITourDailyRepository';

@injectable()
export class TourDailyRepository extends BaseRepository<TourDaily> implements ITourDailyRepository {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) unitOfWork: UnitOfWork) {
    super(unitOfWork, TourDaily)
  }

  
}
