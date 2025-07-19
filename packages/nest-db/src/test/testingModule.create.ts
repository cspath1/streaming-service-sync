import { Test } from '@nestjs/testing';
import type { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';

/**
 * @description Wraps the `createTestingModule` method of `@nestjs/testing` to remove logging
 * @param moduleData
 * @returns
 */
export const createTestingModule = async (moduleData: ModuleMetadata) =>
  await Test.createTestingModule(moduleData)
    .setLogger({
      log: () => {},
      debug: () => {},
      warn: () => {},
      error: () => {},
      verbose: () => {},
    })
    .compile();
