import { TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { beforeAll, describe, expect, it } from 'vitest';
import { createTestingModule } from '../../../test/utils/testingModule.create';
import { AuthModule } from '../auth.module';
import { UserGuard } from './user.guard';

describe('BotGuard', () => {
  let guard: UserGuard;

  beforeAll(async () => {
    const module: TestingModule = await createTestingModule({
      imports: [AuthModule],
    });

    guard = module.get<UserGuard>(UserGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return false if userId is missing from decoded user', () => {
    const context = createMockExecutionContext({});
    expect(guard.canActivate(context)).toBe(false);
  });

  it('should return true if userId exists', () => {
    const context = createMockExecutionContext({
      decodedToken: { userId: 'DUMMY_USER_ID' },
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
