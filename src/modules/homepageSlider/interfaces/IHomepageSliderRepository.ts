import { HomepageSlider } from 'orm/entities/homepageSlider/HomepageSlider';

export interface IHomepageSliderRepository {
  getAll(): Promise<HomepageSlider[] | void>;
  getById(id: number): Promise<HomepageSlider | void>;
  create(newHomepageSlider: HomepageSlider): Promise<HomepageSlider>;
  update(id: number, tag: HomepageSlider): Promise<HomepageSlider>;
  delete(id: number): Promise<void>;
}
