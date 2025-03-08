import { inject, injectable } from 'inversify';
import { ITourServiceRepository } from '../interfaces/ITourServiceRepository';
import { BaseRepository } from 'shared/repositories/BaseRepository';
import { TourService } from 'orm/entities/tour/TourService';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { INTERFACE_TYPE } from 'core/types';

@injectable()
export class TourServiceRepository extends BaseRepository<TourService> implements ITourServiceRepository {
    constructor(@inject(INTERFACE_TYPE.UnitOfWork) unitOfWork: UnitOfWork) {
        super(unitOfWork, TourService)
    }
}
