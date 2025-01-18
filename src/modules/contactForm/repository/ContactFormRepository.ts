import AppDataSource from 'config/database';
import { IContactFormRepository } from 'modules/contactForm/interfaces/IContactFormRepository';
import { inject, injectable } from 'inversify';
import { ContactForm } from 'orm/entities/contactForm/ContactForm';
import { IDatabaseService } from 'core/interface/IDatabaseService';
import { InternalServerErrorException, NotFoundException } from 'shared/errors/allException';
import { getRepository, Repository } from 'typeorm';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';

@injectable()
export class ContactFormRepository implements IContactFormRepository {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork) {}

  async getAll(): Promise<ContactForm[] | void> {
    try {
      const repo = await this.unitOfWork.getRepository(ContactForm);
      const contactForms = await repo.find();
      if (contactForms) return contactForms as ContactForm[];
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  async getById(id: number): Promise<ContactForm | void> {
    try {
      const repo = await this.unitOfWork.getRepository(ContactForm);
      const contactForm = await repo.findOne({ where: { id: id } });
      if (contactForm) return contactForm as ContactForm;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  async update(id: number, contactForm: ContactForm): Promise<ContactForm> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(ContactForm)).update(id, contactForm);
      await this.unitOfWork.commitTransaction();
      return contactForm;
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.unitOfWork.startTransaction();
      await (await this.unitOfWork.getRepository(ContactForm)).delete(id);
      await this.unitOfWork.commitTransaction();
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteMultiple(ids: number[]): Promise<void> {
    try {
      await this.unitOfWork.startTransaction();
      const repo = await this.unitOfWork.getRepository(ContactForm);
      ids.forEach(async (id) => await repo.delete(id));
      await this.unitOfWork.commitTransaction();
    } catch (error) {
      await this.unitOfWork.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    }
  }
}
