import { Injectable, Logger } from '@nestjs/common';
import { ErrorResult, SuccessResult } from '@repo/core';
import { prisma, Prisma } from '@repo/database';

@Injectable()
export class SyncCreateService {
  private readonly logger = new Logger(SyncCreateService.name);

  public async create(
    data: Prisma.SyncCreateInput | Prisma.SyncUncheckedCreateInput,
  ) {
    try {
      const sync = await prisma.sync.create({
        data,
      });
      return new SuccessResult(sync);
    } catch (error: any) {
      this.logger.error('Failed to create sync', error);
      return new ErrorResult(
        error.message ?? 'Unknown error occurred while creating sync',
        [error],
      );
    }
  }
}
