import { Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { BcryptService } from './bcrypt.service';

@Global() // <-- Make the module global (available everywhere without importing)
@Module({
  providers: [JwtService, BcryptService],
  exports: [JwtService, BcryptService],
})
export class ServicesModule {}