import { FaqSuccessDTO } from 'modules/faq/dto/FaqSuccessDTO';
import { IFaqService } from 'modules/faq/interfaces/IFaqService';
import { IFaqRepository } from 'modules/faq/interfaces/IFaqRepository';
import { inject, injectable, named } from 'inversify';
import { BadRequestException, NotFoundException } from 'shared/errors/allException';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { INTERFACE_TYPE } from 'core/types';
import { ISeoLinkService } from 'shared/interfaces/ISeoLinkService';
import { CreateFaqDto } from '../dto/CreateFaqDto';
import { FAQ } from 'orm/entities/faq/FAQ';
import { DeleteMultipleFaqDto } from '../dto/DeleteMultipleFaqDto';
import { Transactional } from 'shared/decorators/Transactional';

@injectable()
export class FaqService implements IFaqService {
  private repository: IFaqRepository;
  private unitOfWork: UnitOfWork;

  constructor(
    @inject(INTERFACE_TYPE.UnitOfWork) unitOfWork: UnitOfWork,
    @inject(INTERFACE_TYPE.IFaqRepository) repository,
    @inject(INTERFACE_TYPE.ISeoLinkService) private readonly seoLinkService: ISeoLinkService,
  ) {
    this.repository = repository;
    this.unitOfWork = unitOfWork;
  }

  public async getAll(): Promise<FaqSuccessDTO[]> {
    const faqs = await this.repository.getAll();
    if (faqs && faqs.length) return faqs as FaqSuccessDTO[];
    // throw new NotFoundException('No faqs found');
    return [];
  }

  public async getById(id: string): Promise<FaqSuccessDTO> {
    const faq = await this.repository.getById(Number(id));
    if (faq) return faq as FaqSuccessDTO;
    throw new NotFoundException('Faq not found');
  }

  @Transactional()
  async createFaq(faqData: CreateFaqDto): Promise<FAQ> {
    const newFaq = new FAQ();
    newFaq.Question = faqData.Question;
    newFaq.Answer = faqData.Answer;
    newFaq.Order = faqData.Order;
    return await this.repository.create(newFaq);
  }

  @Transactional()
  async updateFaq(id: string, faqData: CreateFaqDto): Promise<FAQ> {
    const faq = await this.repository.getById(Number(id));
    if (!faq) throw new NotFoundException(`Faq with id:'${id}' is not found`);
    faq.Question = faqData.Question;
    faq.Answer = faqData.Answer;
    faq.Order = faqData.Order;
    return await this.repository.update(Number(id), faq);
  }

  async deleteFaq(id: string): Promise<void> {
    const faq = await this.repository.getById(Number(id));
    if (!faq) throw new NotFoundException(`Faq with id:'${id}' is not found`);
    await this.repository.delete(Number(id));
  }

  async deleteMultipleFaq(faqs: DeleteMultipleFaqDto): Promise<void> {
    await this.repository.deleteMultiple(faqs.ids);
  }
}
