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