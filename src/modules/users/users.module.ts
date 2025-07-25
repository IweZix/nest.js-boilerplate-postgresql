import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/db.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

// typeOrmModule is used to connect to the database and manage the User entity and automatically create the necessary database tables.
// DatabaseModule is imported to handle database connections and configurations.

@Module({
  imports: [TypeOrmModule.forFeature([User]), DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
