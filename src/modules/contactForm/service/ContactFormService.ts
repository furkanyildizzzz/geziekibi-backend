import { ContactFormSuccessDTO } from 'modules/contactForm/dto/ContactFormSuccessDTO';
import { IContactFormService } from 'modules/contactForm/interfaces/IContactFormService';
import { IContactFormRepository } from 'modules/contactForm/interfaces/IContactFormRepository';
import { inject, injectable, named } from 'inversify';
import { ContactForm } from 'orm/entities/contactForm/ContactForm';
import { BadRequestException, InternalServerErrorException, NotFoundException } from 'shared/errors/allException';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { INTERFACE_TYPE } from 'core/types';
import { UpdateContactFormDTO } from '../dto/UpdateContactFormDTO';
import { BadRequestErrorMessageResult } from 'inversify-express-utils/lib/results';
import { DeleteMultipleContactFormDto } from '../dto/DeleteMultipleContactFormDto';
import { ISeoLinkService } from 'shared/interfaces/ISeoLinkService';
import { ResponseContactFormDTO } from '../dto/ResponseContactFormDTO';
import { EmailService } from 'shared/services/EmailService';
import { EmailTemplateEnum } from 'shared/utils/enum';
import { plainToInstance } from 'class-transformer';
import { Transactional } from 'shared/decorators/Transactional';

@injectable()
export class ContactFormService implements IContactFormService {
  private repository: IContactFormRepository;
  private unitOfWork: UnitOfWork;

  constructor(
    @inject(INTERFACE_TYPE.UnitOfWork) unitOfWork: UnitOfWork,
    @inject(INTERFACE_TYPE.IContactFormRepository) repository,
    @inject(INTERFACE_TYPE.ISeoLinkService) private readonly seoLinkService: ISeoLinkService,
    @inject(INTERFACE_TYPE.IEmailService) private readonly emailService: EmailService,
  ) {
    this.repository = repository;
    this.unitOfWork = unitOfWork;
  }

  public async getAll(): Promise<ContactFormSuccessDTO[]> {
    const contactForms = await this.repository.getAll();
    if (contactForms && contactForms.length) {
      return plainToInstance(ContactFormSuccessDTO, contactForms, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    }

    return [];
  }

  public async getById(id: string): Promise<ContactFormSuccessDTO> {
    const contactForm = await this.repository.getById(Number(id));
    if (contactForm)
      return plainToInstance(ContactFormSuccessDTO, contactForm, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    throw new NotFoundException('contact_form_id_not_found', { id });
  }

  @Transactional()
  async updateContactForm(id: string, contactFormData: UpdateContactFormDTO): Promise<ContactFormSuccessDTO> {
    const contactForm = (await this.repository.getById(Number(id))) || new ContactForm();
    // if (!contactForm) throw new NotFoundException(`ContactForm with id:'${id}' is not found`);
    // contactForm.name = contactFormData.name;
    // contactForm.seoLink = await this.seoLinkService.generateUniqueSeoLink(
    //   contactFormData.name,
    //   'contactForm',
    //   contactForm.id,
    // );
    await this.repository.update(Number(id), contactForm);
    return plainToInstance(ContactFormSuccessDTO, contactForm, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  async deleteContactForm(id: string): Promise<void> {
    const contactForm = await this.repository.getById(Number(id));
    if (!contactForm) throw new NotFoundException('contact_form_id_not_found', { id });
    await this.repository.delete(Number(id));
  }

  async deleteMultipleContactForm(contactForms: DeleteMultipleContactFormDto): Promise<void> {
    await this.repository.deleteMultiple(contactForms.ids);
  }

  @Transactional()
  async responseContactForm(id: string, answerFormData: ResponseContactFormDTO): Promise<ContactFormSuccessDTO> {
    const contactForm = (await this.repository.getById(Number(id))) || new ContactForm();
    if (!contactForm) throw new NotFoundException('contact_form_id_not_found', { id });

    try {
      contactForm.response = answerFormData.response;
      contactForm.isResponded = true;
      await this.repository.update(Number(id), contactForm);

      await this.emailService.sendEmail(process.env.SMTP_EMAIL, EmailTemplateEnum.USER_CONTACT_FORM_ANSWERED, {
        name: contactForm.fullName,
        message: contactForm.message,
        answer: contactForm.response,
      });

      return plainToInstance(ContactFormSuccessDTO, contactForm, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("internal_server_error", { error: error.message });
    }
  }
}
