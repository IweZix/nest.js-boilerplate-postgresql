import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { config } from '../../utils/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.host,
  port: config.port,
  username: config.postgres,
  password: config.password,
  database: config.database,
  entities: [User],
  migrations: ['src/modules/database/migrations/*.ts'],
  synchronize: false,
});

/**
 * Intialize the DataSource if it is not already initialized.
 * This is necessary because better-auth needs to access the database connection,
 * and we want to ensure that it is initialized before better-auth tries to use it.
 */
export const InitializeDataSource = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
};