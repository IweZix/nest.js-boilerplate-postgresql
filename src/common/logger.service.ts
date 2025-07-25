import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class MyLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    // Personalized log format
    const customFormat = winston.format.printf(
      ({ level, message, timestamp, context }) => {
        const dateFormatted = new Date().toLocaleString('fr-FR', {
          hour12: true,
        });

        // ANSI colors for console output
        const colors = {
          info: '\x1b[32m', // vert
          error: '\x1b[31m', // rouge
          warn: '\x1b[33m', // jaune
          debug: '\x1b[34m', // bleu
          verbose: '\x1b[35m', // magenta
        };
        const reset = '\x1b[0m';
        const levelColor = colors[level] || '';

        // Context color
        const yellow = '\x1b[33m';
        const ctx = context ? ` ${yellow}[${context}]${reset}` : '';

        return `${levelColor}[${level.toUpperCase()}]${reset} - ${dateFormatted}${ctx} ${message}`;
      },
    );

    const transportConsole = new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.splat(),
        customFormat,
      ),
    });

    const transportFile = new winston.transports.DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      zippedArchive: true,
      level: 'info',
      format: winston.format.combine(winston.format.timestamp(), customFormat),
    });

    this.logger = winston.createLogger({
      level: 'info',
      transports: [transportConsole, transportFile],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }
  error(message: string, trace?: string, context?: string) {
    this.logger.error(trace ? `${message} - ${trace}` : message, { context });
  }
  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }
  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }
  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
