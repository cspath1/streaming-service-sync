import { Module } from '@nestjs/common';
import { SyncDataModule } from './sync/sync.data.module';
import { SyncAuditDataModule } from './syncAudit/syncAudit.data.module';

@Module({
  imports: [SyncDataModule, SyncAuditDataModule],
  exports: [SyncDataModule, SyncAuditDataModule],
})
export class DbModule {}
