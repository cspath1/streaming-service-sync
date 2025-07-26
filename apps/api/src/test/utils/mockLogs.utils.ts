import { vi } from 'vitest';

export const mockLogs = () => {
  vi.mock('@nestjs/common', async () => {
    const originalModule = await vi.importActual('@nestjs/common');
    return {
      ...originalModule,
      Logger: class MockLogger {
        static log = vi.fn();
        static error = vi.fn();
        static warn = vi.fn();
        static debug = vi.fn();
        static verbose = vi.fn();

        log = vi.fn();
        error = vi.fn();
        warn = vi.fn();
        debug = vi.fn();
        verbose = vi.fn();
      },
    };
  });
};
