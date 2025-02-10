import { inject, injectable } from 'inversify';
import { DataSource, ObjectType, QueryRunner, Repository } from 'typeorm';
import { Logger } from '../../shared/services/Logger';
import { IDatabaseService } from '../interface/IDatabaseService';
import { INTERFACE_TYPE } from 'core/types';
import AppDataSource from 'config/database';

@injectable()
export class DatabaseService implements IDatabaseService {
  constructor(@inject(INTERFACE_TYPE.Logger) private readonly logger: Logger) {}

  public async getConnection(): Promise<DataSource> {
    if (AppDataSource.isInitialized) {
      this.logger.info('Connection Already Established!');
      console.log('Connection Already Established!');
      return AppDataSource;
    }

    try {
      await AppDataSource.initialize();
      this.logger.info('Connection Established!');
      console.log('Connection Established!');
    } catch (error) {
      this.logger.error(`Connection Failed. Error: ${error}`);
      console.log(`Connection Failed. Error: ${error}`);
    }

    return AppDataSource;
  }

  public async getRepository(entity: ObjectType<any>): Promise<Repository<any>> {
    const connection = await this.getConnection();
    return await connection?.getRepository(entity);
  }
}
