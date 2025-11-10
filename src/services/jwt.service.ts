import { Injectable, Logger } from '@nestjs/common';
import { config } from '../utils/config';
import { Role } from 'src/common/enums/role.enum';
import * as jwt from 'jsonwebtoken';

/**
 * JwtService handles JWT token generation
 */
@Injectable()
export class JwtService {
  private readonly logger = new Logger(JwtService.name);

  private readonly JWT_SECRET: string = config.jwtSecret;
  private readonly JWT_LIFETIME: number = config.jwtLifetime;

  constructor() {}

  async signToken(userId: number, role: Role): Promise<string> {
    this.logger.log(`entered in [${this.signToken.name}] function`);
    return jwt.sign({ id: userId, role }, this.JWT_SECRET, {
      expiresIn: this.JWT_LIFETIME,
    });
  }
}
