import { inject, injectable } from 'inversify';
import { ITourServiceInteractor } from '../interfaces/ITourServiceInteractor';

@injectable()
export class TourServiceInteractor implements ITourServiceInteractor {}
