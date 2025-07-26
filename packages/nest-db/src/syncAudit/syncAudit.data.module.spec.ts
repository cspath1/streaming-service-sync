import { TestingModule } from '@nestjs/testing';
import { beforeAll, describe, expect, it } from 'vitest';
import { createTestingModule } from '../test/testingModule.create';
import { SyncAuditDataModule } from './syncAudit.data.module';
import { SyncAuditCreateService } from './services';

describe('SyncAuditDataModule', () => {
  let syncAuditDataModule: TestingModule;
  let syncAuditCreateService: SyncAuditCreateService;

  beforeAll(async () => {
    syncAuditDataModule = await createTestingModule({
      imports: [SyncAuditDataModule],
    });

    syncAuditCreateService = syncAuditDataModule.get<SyncAuditCreateService>(
      SyncAuditCreateService,
    );
  });

  it('should be defined', () => {
    expect(syncAuditDataModule).toBeDefined();
  });

  it('should resolve services', () => {
    expect(syncAuditCreateService).toBeInstanceOf(SyncAuditCreateService);
  });
});
