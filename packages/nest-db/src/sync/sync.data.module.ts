import { Module } from '@nestjs/common';
import { SyncCreateService } from './services/sync.create.service';

@Module({
  exports: [SyncCreateService],
  providers: [SyncCreateService],
})
export class SyncDataModule {}
