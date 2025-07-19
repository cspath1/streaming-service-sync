import { JwtService } from '@nestjs/jwt';
import { prisma, seedDatabase } from '@repo/database';
import { TestProject } from 'vitest/node';
import { AppModule } from '../app.module';
import { Test } from '@nestjs/testing';
import { LogModule } from '../modules/log/log.module';
import { ZodValidationPipe } from 'nestjs-zod';
import request from 'supertest';

export default async function (project: TestProject) {
  if (project.config.env.TEST_E2E !== 'true') {
    project.provide('SKIP_E2E', true);
    return;
  }

  process.env = {
    ...process.env,
    ...project.config.env,
  };

  seedDatabase();

  const jwtService = new JwtService({});
  process.env.BOT_TOKEN = jwtService.sign(project.config.env.BOT_SECRET ?? '', {
    secret: project.config.env.JWT_SECRET,
  });

  let moduleRef;

  if (project.config.env.DISPLAY_SERVER_LOGS === 'true') {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  } else {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(LogModule)
      .useModule({
        module: class {},
        imports: [],
        controllers: [],
        providers: [],
      })
      .setLogger({
        log: () => {},
        debug: () => {},
        warn: () => {},
        error: () => {},
        verbose: () => {},
      })
      .compile();
  }

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ZodValidationPipe());
  const port = project.config.env.SERVER_PORT ?? 3000;
  await app.listen(port);
  await request(app.getHttpServer())
    .post('/integration/sync')
    .set('Authorization', `Bearer ${process.env.BOT_TOKEN}`);
  project.provide('app', `http://localhost:${port}`);

  //teatdown callback
  return async () => {
    await app.close();
    if (project.config.env.CLEAN_DATABASE === 'true') {
      await prisma.syncAudit.deleteMany();
      await prisma.sync.deleteMany();
    }
    await prisma.$disconnect();
  };
}

declare module 'vitest' {
  export interface ProvidedContext {
    app: string;
    CLEAN_DATABASE: boolean;
    SKIP_E2E: boolean;
  }
}
