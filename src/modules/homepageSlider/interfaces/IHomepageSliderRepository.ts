import { HomepageSlider } from 'orm/entities/homepageSlider/HomepageSlider';
import { IBaseRepository } from 'shared/interfaces/IBaseRepository';

export interface IHomepageSliderRepository extends IBaseRepository<HomepageSlider> {
  // getAll(): Promise<HomepageSlider[] | void>;
  // getById(id: number): Promise<HomepageSlider | void>;
  // create(newHomepageSlider: HomepageSlider): Promise<HomepageSlider>;
  // update(id: number, tag: HomepageSlider): Promise<HomepageSlider>;
  // delete(id: number): Promise<void>;
}
