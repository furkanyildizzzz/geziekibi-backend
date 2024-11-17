import { AppDataSource } from 'config/database';
import { injectable } from 'inversify';
import { DataSource, QueryRunner } from 'typeorm';

@injectable()
export class UnitOfWork {
  private dataSource: DataSource;
  private queryRunner?: QueryRunner;

  constructor() {
    this.dataSource = AppDataSource;
  }

  async startTransaction() {
    if (this.queryRunner) {
      throw new Error('Transaction is already active');
    }
    this.queryRunner = this.dataSource.createQueryRunner();
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

  getRepository<T>(entity: { new (): T }) {
    if (!this.queryRunner) {
      return this.dataSource.getRepository(entity);
    }
    return this.queryRunner.manager.getRepository(entity);
  }
}
