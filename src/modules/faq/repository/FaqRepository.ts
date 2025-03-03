import { IFaqRepository } from 'modules/faq/interfaces/IFaqRepository';
import { inject, injectable } from 'inversify';
import { InternalServerErrorException } from 'shared/errors/allException';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { FAQ } from 'orm/entities/faq/FAQ';
import { BaseRepository } from 'shared/repositories/BaseRepository';

@injectable()
export class FaqRepository extends BaseRepository<FAQ> implements IFaqRepository {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) unitOfWork: UnitOfWork) {
    super(unitOfWork, FAQ)
  }

  // async getAll(): Promise<FAQ[] | void> {
  //   try {
  //     const repo = await this.unitOfWork.getRepository(FAQ);
  //     const faqs = await repo.find();
  //     if (faqs) return faqs as FAQ[];
  //   } catch (error) {
  //     throw new InternalServerErrorException(`${error.message}`);
  //   }
  // }

  // async getById(id: number): Promise<FAQ | void> {
  //   try {
  //     const repo = await this.unitOfWork.getRepository(FAQ);
  //     const faq = await repo.findOne({ where: { id: id } });
  //     if (faq) return faq as FAQ;
  //   } catch (error) {
  //     throw new InternalServerErrorException(`${error.message}`);
  //   }
  // }

  // async create(newFAQ: FAQ): Promise<FAQ> {
  //   try {
  //     await this.unitOfWork.startTransaction();
  //     await (await this.unitOfWork.getRepository(FAQ)).save(newFAQ);
  //     await this.unitOfWork.commitTransaction();
  //     return newFAQ;
  //   } catch (error) {
  //     await this.unitOfWork.rollbackTransaction();
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  // async update(id: number, faq: FAQ): Promise<FAQ> {
  //   try {
  //     await this.unitOfWork.startTransaction();
  //     await (await this.unitOfWork.getRepository(FAQ)).update(id, faq);
  //     await this.unitOfWork.commitTransaction();
  //     return faq;
  //   } catch (error) {
  //     await this.unitOfWork.rollbackTransaction();
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  // async delete(id: number): Promise<void> {
  //   try {
  //     await this.unitOfWork.startTransaction();
  //     await (await this.unitOfWork.getRepository(FAQ)).delete(id);
  //     await this.unitOfWork.commitTransaction();
  //   } catch (error) {
  //     await this.unitOfWork.rollbackTransaction();
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  // async deleteMultiple(ids: number[]): Promise<void> {
  //   try {
  //     await this.unitOfWork.startTransaction();
  //     const repo = await this.unitOfWork.getRepository(FAQ);
  //     ids.forEach(async (id) => await repo.delete(id));
  //     await this.unitOfWork.commitTransaction();
  //   } catch (error) {
  //     await this.unitOfWork.rollbackTransaction();
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
}
