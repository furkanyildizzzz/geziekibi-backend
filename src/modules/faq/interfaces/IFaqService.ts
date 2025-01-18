import { CreateFaqDto } from '../dto/CreateFaqDto';
import { DeleteMultipleFaqDto } from '../dto/DeleteMultipleFaqDto';
import { FaqSuccessDTO } from '../dto/FaqSuccessDTO';

export interface IFaqService {
  getAll(): Promise<FaqSuccessDTO[]>;
  getById(id: string): Promise<FaqSuccessDTO>;
  createFaq(faqData: CreateFaqDto): Promise<FaqSuccessDTO>;
  updateFaq(id: string, faqData: CreateFaqDto): Promise<FaqSuccessDTO>;
  deleteFaq(id: string): Promise<void>;
  deleteMultipleFaq(faqs: DeleteMultipleFaqDto): Promise<void>;
}
