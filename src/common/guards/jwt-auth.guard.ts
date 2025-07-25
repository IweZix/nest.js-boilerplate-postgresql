import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      this.logger.error(`[${this.canActivate.name}] Token is required`);
      throw new UnauthorizedException('Token is required');
    }

    const token = authHeader;

    if (!token) {
      this.logger.error(`[${this.canActivate.name}] Bearer token is required`);
      throw new UnauthorizedException('Bearer token is required');
    }

    try {
      const token = authHeader.replace(/"/g, '');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      request.user = decoded;
      return true;
    } catch (error) {
      this.logger.error(
        `[${this.canActivate.name}] Invalid token: ${error.message}`,
      );
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}