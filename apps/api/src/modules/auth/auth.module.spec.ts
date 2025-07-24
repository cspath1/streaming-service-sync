import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { BotGuard } from './guards/bot.guard';
import { UserGuard } from './guards/user.guard';
import { AuthTokenSignService } from './services/auth.token.sign.service';
import { createTestingModule } from '../../test/utils/testingModule.create';

describe('AuthModule', () => {
  let authModule: TestingModule;
  let botGuard: BotGuard;
  let userGuard: UserGuard;
  let authTokenSignService: AuthTokenSignService;

  beforeAll(async () => {
    authModule = await createTestingModule({
      imports: [AuthModule],
    });

    botGuard = authModule.get<BotGuard>(BotGuard);
    userGuard = authModule.get<UserGuard>(UserGuard);
    authTokenSignService =
      authModule.get<AuthTokenSignService>(AuthTokenSignService);
  });

  afterAll(async () => {
    await authModule.close();
  });

  it('should be defined', () => {
    expect(authModule).toBeDefined();
  });

  it('should resolve guards and services', () => {
    expect(botGuard).toBeInstanceOf(BotGuard);
    expect(userGuard).toBeInstanceOf(UserGuard);
    expect(authTokenSignService).toBeInstanceOf(AuthTokenSignService);
  });
});
