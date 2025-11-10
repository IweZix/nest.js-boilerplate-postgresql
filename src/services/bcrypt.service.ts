import { Injectable, Logger } from '@nestjs/common';
import { config } from '../utils/config';
import * as bcrypt from 'bcrypt';

/**
 * BcryptService handles password hashing and comparison
 */
@Injectable()
export class BcryptService {
  private readonly logger = new Logger(BcryptService.name);

  private readonly SALT_ROUNDS: number = config.saltRounds;

  constructor() {}

  /**
   * Hashes a plain text password
   * @param {string} password - The plain text password to hash
   * @returns {Promise<string>} - The hashed password
   */
  async hashPassword(password: string): Promise<string> {
    this.logger.log(`entered in [${this.hashPassword.name}] function`);
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compares a plain text password with a hashed password
   * @param {string} plainPassword - The plain text password to compare
   * @param {string} hashedPassword - The hashed password to compare against
   * @returns {Promise<boolean>} - True if the passwords match, false otherwise
   */
  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    this.logger.log(`entered in [${this.comparePasswords.name}] function`);
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
