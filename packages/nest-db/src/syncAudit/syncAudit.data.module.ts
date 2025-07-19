import { Module } from '@nestjs/common';
import { SyncAuditCreateService } from './services/syncAudit.create.service';

@Module({
  providers: [SyncAuditCreateService],
  exports: [SyncAuditCreateService],
})
export class SyncAuditDataModule {}
