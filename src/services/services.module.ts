import { Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { BcryptService } from './bcrypt.service';
import { MailService } from './mail.service';

@Global() // <-- Make the module global (available everywhere without importing)
@Module({
  providers: [JwtService, BcryptService, MailService],
  exports: [JwtService, BcryptService, MailService],
})
export class ServicesModule {}