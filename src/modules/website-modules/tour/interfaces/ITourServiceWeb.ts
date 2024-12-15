import { TourDtoWeb } from '../dto/TourDtoWeb';
import { TourListDtoWeb } from '../dto/TourListDtoWeb';

export interface ITourServiceWeb {
  getAll(): Promise<TourListDtoWeb[]>;
  getBySeoLink(seoLink: string): Promise<TourDtoWeb>;
}
