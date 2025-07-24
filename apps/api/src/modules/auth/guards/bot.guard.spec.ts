import { TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { BotGuard } from './bot.guard';
import { beforeAll, describe, expect, it } from 'vitest';
import { createTestingModule } from '../../../test/utils/testingModule.create';
import { AuthModule } from '../auth.module';

describe('BotGuard', () => {
  let guard: BotGuard;

  beforeAll(async () => {
    const module: TestingModule = await createTestingModule({
      imports: [AuthModule],
    });

    guard = module.get<BotGuard>(BotGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return false if bot is missing from decoded user', () => {
    const context = createMockExecutionContext({});
    expect(guard.canActivate(context)).toBe(false);
  });

  it('should return false if bot is false', () => {
    const context = createMockExecutionContext({
      decodedToken: { bot: false },
    });
    expect(guard.canActivate(context)).toBe(false);
  });

  it('should return true if bot is true', () => {
    const context = createMockExecutionContext({
      decodedToken: { bot: true },
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  function createMockExecutionContext(body: any): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          body,
        }),
      }),
    } as unknown as ExecutionContext;
  }
});
