import { PrismaClient } from '../generated/client';
import { clientExtension } from '../generated/clientExtension';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient().$extends(clientExtension);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export * from '../generated/client';
