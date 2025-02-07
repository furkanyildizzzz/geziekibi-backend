import { CreateHomepageSliderDto } from '../dto/CreateHomepageSliderDto';
import { HomepageSliderSuccessDto } from '../dto/HomepageSliderSuccessDto';

export interface IHomepageSliderService {
  getAll(): Promise<HomepageSliderSuccessDto[]>;
  getById(id: string): Promise<HomepageSliderSuccessDto>;
  createHomepageSlider(
    tourCategoryData: CreateHomepageSliderDto,
    files: Express.Multer.File[],
  ): Promise<HomepageSliderSuccessDto>;
  updateHomepageSlider(
    id: string,
    tourCategoryData: CreateHomepageSliderDto,
    files: Express.Multer.File[],
  ): Promise<HomepageSliderSuccessDto>;
  deleteHomepageSlider(id: string): Promise<void>;
}
