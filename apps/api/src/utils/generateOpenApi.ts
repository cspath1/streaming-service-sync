import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';
import { version, description } from '../../package.json';
import { INestApplication } from '@nestjs/common';

/**
 * @description Generate OpenAPI documentation for the application
 * @param app - The NestJS application instance
 * @returns The generated OpenAPI document
 */
export function generateOpenApiDocument(app: INestApplication<any>) {
  //patch swagger to use zod schemas
  //@see https://github.com/BenLorantfy/nestjs-zod?tab=readme-ov-file#openapi-swagger-support
  patchNestJsSwagger();

  const operationIdFactory = (controllerKey: string, methodKey: string) =>
    `${controllerKey.replace('Controller', '').toLocaleLowerCase()}${methodKey[0].toUpperCase()}${methodKey.slice(1)}`;

  //generate openAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Boostpoint ATS')
    .setDescription(description)
    .setVersion(version)
    .addServer(`http://localhost:${process.env.SERVER_PORT ?? 3000}`, 'local')
    .addServer(`https://ats.boostpoint.com`, 'production')
    .addServer(`https://ats-staging.boostpoint.com`, 'staging')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory,
  });

  return document;
}
