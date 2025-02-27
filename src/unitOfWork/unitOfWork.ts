import { IDatabaseService } from 'core/interface/IDatabaseService';
import { INTERFACE_TYPE } from 'core/types';
import { inject, injectable } from 'inversify';
import { DataSource, QueryRunner } from 'typeorm';

@injectable()
export class UnitOfWork {
  private dataSource!: DataSource;
  private queryRunner?: QueryRunner;

  constructor(@inject(INTERFACE_TYPE.IDatabaseService) private readonly database: IDatabaseService) {}

  /**
   * Bağlantıyı lazily al, böylece gereksiz bağlantı oluşturulmaz.
   */
  private async getDataSource(): Promise<DataSource> {
    if (!this.dataSource) {
      this.dataSource = await this.database.getConnection();
    }
    return this.dataSource;
  }

  async startTransaction() {
    if (this.queryRunner) {
      throw new Error('Transaction is already active');
    }
    const ds = await this.getDataSource();
    this.queryRunner = ds.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  async commitTransaction() {
    if (!this.queryRunner) {
      throw new Error('No active transaction to commit');
    }
    try {
      await this.queryRunner.commitTransaction();
    } finally {
      await this.queryRunner.release();
      this.queryRunner = undefined;
    }
  }

  async rollbackTransaction() {
    if (!this.queryRunner) {
      throw new Error('No active transaction to roll back');
    }
    try {
      await this.queryRunner.rollbackTransaction();
    } finally {
      await this.queryRunner.release();
      this.queryRunner = undefined;
    }
  }

  async getRepository<T>(entity: { new (): T }) {
    const ds = await this.getDataSource();
    return this.queryRunner ? this.queryRunner.manager.getRepository(entity) : ds.getRepository(entity);
  }
}
