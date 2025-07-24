import { describe, it, expect, vi, beforeAll } from 'vitest';
import { AuthMiddleware } from './auth.middleware';
import { JwtService } from '@nestjs/jwt';

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware;
  let jwtService: JwtService;
  let validBotToken: string;
  let validUserToken: string;
  const userId = 'DUMMY_USER_ID';
  beforeAll(() => {
    jwtService = new JwtService({});
    authMiddleware = new AuthMiddleware(jwtService);
    validBotToken = jwtService.sign(process.env.BOT_SECRET ?? '', {
      secret: process.env.JWT_SECRET,
    });
    validUserToken = jwtService.sign(
      { userId },
      { secret: process.env.JWT_SECRET },
    );
  });

  it('should remove a decodedToken property if it is set in the body before hitting middleware', async () => {
    const req = {
      headers: {},
      body: { decodedToken: { bot: true, userId: 'INJECTED_USER_ID' } } as any,
    };
    const res = {};
    const next = vi.fn();

    await authMiddleware.use(req as any, res as any, next);

    expect(req.body.decodedToken).toEqual({ userId: null, bot: false });
    expect(next).toHaveBeenCalled();
  });

  it('should set decodedToken in request body if token is valid user token', async () => {
    const req = {
      headers: { authorization: `Bearer ${validUserToken}` },
      body: {} as any,
    };
    const res = {};
    const next = vi.fn();

    await authMiddleware.use(req as any, res as any, next);

    expect(req.body.decodedToken).toEqual({
      bot: false,
      userId,
    });
    expect(next).toHaveBeenCalled();
  });

  it('should set bot in request body if token is valid bot token', async () => {
    const req = {
      headers: { authorization: `Bearer ${validBotToken}` },
      body: {} as any,
    };
    const res = {};
    const next = vi.fn();

    await authMiddleware.use(req as any, res as any, next);

    expect(req.body.decodedToken).toEqual({
      bot: true,
      userId: null,
    });
    expect(next).toHaveBeenCalled();
  });

  it('should call next if token is invalid', async () => {
    const req = {
      headers: { authorization: 'Bearer invalid.token' },
      body: {} as any,
    };
    const res = {};
    const next = vi.fn();

    await authMiddleware.use(req as any, res as any, next);

    expect(req.body.decodedToken).toEqual({
      bot: false,
      userId: null,
    });
    expect(vi.spyOn(jwtService, 'verifyAsync')).toThrow();
    expect(next).toHaveBeenCalled();
  });

  it('should call next if no authorization header', async () => {
    const req = {
      headers: {},
      body: {} as any,
    };
    const res = {};
    const next = vi.fn();

    await authMiddleware.use(req as any, res as any, next);

    expect(req.body.decodedToken).toEqual({
      bot: false,
      userId: null,
    });
    expect(next).toHaveBeenCalled();
  });
});
