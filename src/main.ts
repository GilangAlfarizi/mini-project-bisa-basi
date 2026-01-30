import { winstonConfig } from '@infrastructure/configs/winston.config';
import { envsConfig } from '@infrastructure/envs';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { WinstonModule } from 'nest-winston';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig()),
  });

  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    origin: envsConfig().corsOrigin,
    exposedHeaders: ['x-trace-id', 'Content-Disposition'],
  });

  const options = new DocumentBuilder()
    .setTitle('Bisa Basi API')
    .setDescription('Learning API to handle third party services')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document);

  await app.listen(envsConfig().port);
}

bootstrap();
