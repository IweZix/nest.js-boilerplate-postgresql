import { Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { BcryptService } from './bcrypt.service';
import { SendGridService } from './sendgrid.service';

@Global() // <-- Make the module global (available everywhere without importing)
@Module({
  providers: [JwtService, BcryptService, SendGridService],
  exports: [JwtService, BcryptService, SendGridService],
})
export class ServicesModule {}