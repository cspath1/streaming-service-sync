import './instrument';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { apiReference } from '@scalar/nestjs-api-reference';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { version } from '../package.json';
import { ZodValidationPipe } from './pipes/validation/validation.zod.pipe';
import { generateOpenApiDocument } from './utils/generateOpenApi';

/**
 * @description Initialize the application and override NestJS defaults
 */
export async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    snapshot: process.env.NODE_ENV !== 'production',
  });

  const logger = app.get(Logger);
  //use nest-pino as app logger
  app.useLogger(logger);
  //intercepts error to correct stack in err field
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  //global zod validation pipeline
  app.useGlobalPipes(new ZodValidationPipe());

  //generate openAPI documentation
  const document = generateOpenApiDocument(app);

  //serve openAPI documentation
  app.use(
    '/docs',
    apiReference({
      spec: {
        content: document,
      },
    }),
  );

  //startup message
  logger.log(`***************************************************`);
  logger.log(
    `* ATS API v${version} running on port ${process.env.PORT ?? 3000}`,
  );
  logger.log(
    `* Docs are available at http://localhost:${process.env.PORT ?? 3000}/docs`,
  );
  logger.log(`* Environment: ${process.env.NODE_ENV}`);
  logger.log(`* Database URL: ${process.env.DATABASE_URL}`);
  logger.log(`***************************************************\n`);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
