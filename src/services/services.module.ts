import { Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';

@Global() // <-- Make the module global (available everywhere without importing)
@Module({
  providers: [JwtService],
  exports: [JwtService],
})
export class ServicesModule {}