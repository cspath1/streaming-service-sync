import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { TestingModule } from '@nestjs/testing';
import { DatabaseModule } from './db.module';
import { SyncDataModule } from './sync';
import { SyncAuditDataModule } from './syncAudit';
import { createTestingModule } from './test/testingModule.create';

describe('DatabaseModule', () => {
  let databaseModule: TestingModule;
  let syncDataModule: SyncDataModule;
  let syncAuditDataModule: SyncAuditDataModule;

  beforeAll(async () => {
    databaseModule = await createTestingModule({
      imports: [DatabaseModule],
    });

    syncDataModule = databaseModule.get<SyncDataModule>(SyncDataModule);
    syncAuditDataModule =
      databaseModule.get<SyncAuditDataModule>(SyncAuditDataModule);
  });

  afterAll(async () => {
    await databaseModule.close();
  });

  it('should be defined', () => {
    expect(databaseModule).toBeDefined();
  });

  it('should resolve imports', () => {
    expect(syncDataModule).toBeInstanceOf(SyncDataModule);
    expect(syncAuditDataModule).toBeInstanceOf(SyncAuditDataModule);
  });
});
