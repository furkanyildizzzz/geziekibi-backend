import { ContactFormSuccessDTO } from 'modules/contactForm/dto/ContactFormSuccessDTO';
import { IContactFormService } from 'modules/contactForm/interfaces/IContactFormService';
import { IContactFormRepository } from 'modules/contactForm/interfaces/IContactFormRepository';
import { inject, injectable, named } from 'inversify';
import { ContactForm } from 'orm/entities/contactForm/ContactForm';
import { BadRequestException, NotFoundException } from 'shared/errors/allException';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { INTERFACE_TYPE } from 'core/types';
import { UpdateContactFormDTO } from '../dto/UpdateContactFormDTO';
import { BadRequestErrorMessageResult } from 'inversify-express-utils/lib/results';
import { DeleteMultipleContactFormDto } from '../dto/DeleteMultipleContactFormDto';
import { ISeoLinkService } from 'shared/interfaces/ISeoLinkService';

@injectable()
export class ContactFormService implements IContactFormService {
  private repository: IContactFormRepository;
  private unitOfWork: UnitOfWork;

  constructor(
    @inject(INTERFACE_TYPE.UnitOfWork) unitOfWork: UnitOfWork,
    @inject(INTERFACE_TYPE.IContactFormRepository) repository,
    @inject(INTERFACE_TYPE.ISeoLinkService) private readonly seoLinkService: ISeoLinkService,
  ) {
    this.repository = repository;
    this.unitOfWork = unitOfWork;
  }

  public async getAll(): Promise<ContactFormSuccessDTO[]> {
    const contactForms = await this.repository.getAll();
    if (contactForms && contactForms.length) return contactForms as ContactFormSuccessDTO[];
    // throw new NotFoundException('No contactForms found');
    return [];
  }

  public async getById(id: string): Promise<ContactFormSuccessDTO> {
    const contactForm = await this.repository.getById(Number(id));
    if (contactForm) return contactForm as ContactFormSuccessDTO;
    throw new NotFoundException('ContactForm not found');
  }

  async updateContactForm(id: string, contactFormData: UpdateContactFormDTO): Promise<ContactForm> {
    const contactForm = (await this.repository.getById(Number(id))) || new ContactForm();
    // if (!contactForm) throw new NotFoundException(`ContactForm with id:'${id}' is not found`);
    // contactForm.name = contactFormData.name;
    // contactForm.seoLink = await this.seoLinkService.generateUniqueSeoLink(
    //   contactFormData.name,
    //   'contactForm',
    //   contactForm.id,
    // );
    return await this.repository.update(Number(id), contactForm);
  }

  async deleteContactForm(id: string): Promise<void> {
    const contactForm = await this.repository.getById(Number(id));
    if (!contactForm) throw new NotFoundException(`ContactForm with id:'${id}' is not found`);
    await this.repository.delete(Number(id));
  }

  async deleteMultipleContactForm(contactForms: DeleteMultipleContactFormDto): Promise<void> {
    await this.repository.deleteMultiple(contactForms.ids);
  }
}
