import { AppDataSource } from 'config/database';
import { IDatabaseService } from 'core/interface/IDatabaseService';
import { INTERFACE_TYPE } from 'core/types';
import { inject, injectable } from 'inversify';
import { DataSource, QueryRunner } from 'typeorm';

@injectable()
export class UnitOfWork {
  private dataSource: Promise<DataSource>;
  private queryRunner?: QueryRunner;

  constructor(@inject(INTERFACE_TYPE.IDatabaseService) private readonly database: IDatabaseService) {
    this.dataSource = database.getConnection();
    // this.setDataSource();
  }

  // private async setDataSource(): Promise<void> {
  //   this.dataSource = await this.database.getConnection();
  // }

  async startTransaction() {
    if (this.queryRunner) {
      throw new Error('Transaction is already active');
    }
    this.queryRunner = (await this.database.getConnection()).createQueryRunner();
    // this.queryRunner = (await this.dataSource).createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  async commitTransaction() {
    if (!this.queryRunner) {
      throw new Error('No active transaction to commit');
    }
    await this.queryRunner.commitTransaction();
    await this.queryRunner.release();
    this.queryRunner = undefined;
  }

  async rollbackTransaction() {
    if (!this.queryRunner) {
      throw new Error('No active transaction to roll back');
    }
    await this.queryRunner.rollbackTransaction();
    await this.queryRunner.release();
    this.queryRunner = undefined;
  }

  async getRepository<T>(entity: { new (): T }) {
    if (!this.queryRunner) {
      return (await this.database.getConnection()).getRepository(entity);
    }
    return this.queryRunner.manager.getRepository(entity);
  }
}
