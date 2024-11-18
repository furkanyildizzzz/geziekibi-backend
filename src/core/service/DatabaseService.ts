import { inject, injectable } from 'inversify';
import { DataSource, ObjectType, QueryRunner, Repository } from 'typeorm';
import { Logger } from '../../shared/services/Logger';
import { AppDataSource } from '../../config/database';
import { IDatabaseService } from '../interface/IDatabaseService';
import { INTERFACE_TYPE } from 'core/types';

@injectable()
export class DatabaseService implements IDatabaseService {
  private queryRunner?: QueryRunner;
  private static myDataSource: DataSource;
  constructor(@inject(INTERFACE_TYPE.Logger) private readonly logger: Logger) {}

  public async getConnection(): Promise<DataSource> {
    if (DatabaseService.myDataSource?.isInitialized) {
      this.logger.info('Connection Already Established!');
      return DatabaseService.myDataSource;
    }

    try {
      DatabaseService.myDataSource = await AppDataSource.initialize();
      this.logger.info('Connection Established!');
    } catch (error) {
      this.logger.error(`Connection Failed. Error: ${error}`);
    }

    return DatabaseService.myDataSource;
  }

  public async getRepository(entity: ObjectType<any>): Promise<Repository<any>> {
    const connection = await this.getConnection();
    return await connection?.getRepository(entity);
  }
}
