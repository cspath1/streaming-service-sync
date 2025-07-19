import { Injectable, Logger } from '@nestjs/common';
import { ErrorResult, Result, SuccessResult } from '@repo/core';
import { prisma, Prisma, type SyncAudit } from '@repo/database';

@Injectable()
export class SyncAuditCreateService {
  private readonly logger = new Logger(SyncAuditCreateService.name);

  public async create(
    syncAuditData:
      | Prisma.SyncAuditCreateInput
      | Prisma.SyncAuditUncheckedCreateInput,
  ): Promise<Result<SyncAudit>> {
    try {
      const syncAudit = await prisma.syncAudit.create({
        data: syncAuditData,
      });
      return new SuccessResult(syncAudit);
    } catch (error: any) {
      this.logger.error('Failed to create sync audit', error);
      return new ErrorResult(
        error.message ?? 'Unknown error occurred while creating sync audit',
        [error],
      );
    }
  }
}
