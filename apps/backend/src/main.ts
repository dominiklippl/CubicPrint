import { NestFactory } from '@nestjs/core';
import {NestExpressApplication} from "@nestjs/platform-express";
import {AppModule} from "./app.module";
import {Logger, ValidationPipe} from "@nestjs/common";
import dotenv from "dotenv";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

const logger = new Logger('main');
dotenv.config({path: process.cwd() + process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'dev' ? '/.env' : '../.env'});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: true,
    transform: true
  }));

  // 1. CORS (it's always cors)
  app.enableCors({
    origin: true,       // included origin as true
    credentials: true   // included credentials as true
  });

  // 4. Swagger docs
  const config = new DocumentBuilder()
      .setTitle('CubicPrint')
      .setDescription('CubicPrint REST-API documentation')
      .setVersion(process.env.npm_package_version ?? '1.0.0')
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'CubicPrint REST-API'
  });

  // 6. Start express
  const port = process.env.PORT || 5200;
  logger.log(`Starting server on port: ${port} ${process.env.NODE_ENV ? 'with env ' + process.env.NODE_ENV : ''} debugging ${process.env.DEBUGGING ? 'ACTIVE' : 'INACTIVE'}`);
  await app.listen(port);
}
bootstrap();
