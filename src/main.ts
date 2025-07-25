import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { MyLogger } from './common/logger.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('main');

  const app = await NestFactory.create(AppModule, {
    logger: new MyLogger(),
  });

  app.useGlobalFilters(new HttpExceptionFilter(new MyLogger));

  app.enableCors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  const config = new DocumentBuilder()
    .setTitle('Chronos API')
    .setDescription('API documentation for application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  writeFileSync('./openapi.json', JSON.stringify(document, null, 2));

  await app.listen(6001, '0.0.0.0');
  console.log();
  logger.log('API documentation is available at http://localhost:6001/api');
  logger.log('Server is running on http://localhost:6001');
}

bootstrap();
