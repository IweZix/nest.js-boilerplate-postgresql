import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MyLogger } from '../logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: MyLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const context = request.route?.path || 'UnknownRoute';
    const errorMessage = `[${status}] ${formatErrorMessage(message)}`;

    this.logger.error(errorMessage, '', context);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}

function formatErrorMessage(msg: string | object): string {
  if (typeof msg === 'string') return msg;

  // If the message is an object, we try to extract a meaningful message
  if (typeof msg === 'object' && 'message' in msg) {
    if (Array.isArray(msg['message'])) {
      // Case validation errors (class-validator)
      return msg['message'].join(', ');
    }
    return `${msg['message']} (${msg['error'] || ''})`;
  }

  return JSON.stringify(msg);
}
