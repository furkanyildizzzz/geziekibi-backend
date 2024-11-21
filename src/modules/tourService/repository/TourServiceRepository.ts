import { injectable } from 'inversify';
import { ITourServiceRepository } from '../interfaces/ITourServiceRepository';

@injectable()
export class TourServiceRepository implements ITourServiceRepository {}
