import { inject, injectable } from 'inversify';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { TourDate } from 'orm/entities/tour/TourDate';
import { BaseRepository } from 'shared/repositories/BaseRepository';
import { ITourDateRepository } from '../interfaces/ITourDateRepository';

@injectable()
export class TourDateRepository extends BaseRepository<TourDate> implements ITourDateRepository {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) unitOfWork: UnitOfWork) {
    super(unitOfWork, TourDate)
  }

  
}
