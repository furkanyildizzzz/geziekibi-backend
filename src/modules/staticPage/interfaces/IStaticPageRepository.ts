import { StaticPage } from 'orm/entities/static-page/StaticPage';
import { StaticPageType } from 'shared/utils/enum';

export interface IStaticPageRepository {
  getAll(): Promise<StaticPage[] | void>;
  getById(id: number): Promise<StaticPage | void>;
  getByType(pageType: StaticPageType): Promise<StaticPage | void>;
  save(newStaticPage: StaticPage): Promise<StaticPage>;
  update(id: number, tour: StaticPage): Promise<StaticPage>;
  delete(id: number): Promise<void>;
}
