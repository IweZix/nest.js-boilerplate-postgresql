import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://ch43-frontend.iwezix.xyz', 'http://localhost:4200', '*'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });
  await app.listen(6001, '0.0.0.0');
  console.log('Server is running on http://localhost:6001');
}
bootstrap();
