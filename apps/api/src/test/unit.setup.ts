import { prisma } from '@repo/database';
import type { TestProject } from 'vitest/node';

async function sleep(n: number) {
  return new Promise(resolve => setTimeout(resolve, n));
}

let teardownHappened = false;

export default async function (project: TestProject) {
  process.env.DATABASE_URL = project.config.env.DATABASE_URL;

  await sleep(25);

  return async () => {
    if (teardownHappened) {
      return;
    }
    teardownHappened = true;
    if (project.config.env.CLEAN_DATABASE === 'true') {
      await prisma.syncAudit.deleteMany();
      await prisma.sync.deleteMany();
    }

    // Close the Prisma client connection
    await prisma.$disconnect();

    // Optionally, you can clear any global state or perform other cleanup tasks here
    console.log('Teardown completed for project:', project.name);
  };
}
