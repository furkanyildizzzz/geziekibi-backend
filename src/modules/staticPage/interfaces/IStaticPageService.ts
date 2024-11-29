import { StaticPageType } from 'shared/utils/enum';
import { CreateStaticPageDto } from '../dto/CreateStaticPageDto';
import { StaticPageDto } from '../dto/StaticPageDto';
import { StaticPageListDto } from '../dto/StaticPageListDto';

export interface IStaticPageService {
  getAll(): Promise<StaticPageListDto[]>;
  getById(id: string): Promise<StaticPageDto>;
  getByPageType(pageType: StaticPageType): Promise<StaticPageDto>;
  createStaticPage(tourData: CreateStaticPageDto): Promise<StaticPageDto>;
  updateStaticPage(id: string, tourData: CreateStaticPageDto): Promise<StaticPageDto>;
  deleteStaticPage(id: string): Promise<void>;
  uploadBodyImage(files: Express.Multer.File): Promise<string>;
}
