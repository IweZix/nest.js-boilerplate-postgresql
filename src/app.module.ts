import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';

// ? Crash bcs database ?
@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
