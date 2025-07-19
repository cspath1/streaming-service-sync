import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from './pipes/validation/validation.zod.pipe';
import { writeFileSync } from 'fs';
import path from 'path';

/**
 * @description Initialize the application to generate the openAPI documentation
 */
async function bootstrap() {
  //set dummy env vars here

  const app = await NestFactory.create(AppModule);

  //global zod validation pipeline
  app.useGlobalPipes(new ZodValidationPipe());

  const outputPath = path.resolve(process.cwd(), 'openapi.json');
  writeFileSync(outputPath, JSON.stringify(document), { encoding: 'utf8' });

  await app.close();
  process.exit(0);
}
bootstrap();
