import { describe, it, expect, beforeAll } from 'vitest';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenSignService } from './auth.token.sign.service';

describe('AuthTokenSignService', () => {
  let authTokenSignService: AuthTokenSignService;
  let jwtService: JwtService;

  beforeAll(() => {
    jwtService = new JwtService({ secret: 'test-secret' });
    authTokenSignService = new AuthTokenSignService(jwtService);
  });

  it('should sign a payload correctly', () => {
    const payload = { userId: 1 };
    const token = authTokenSignService.sign(payload);
    expect(token).toBeDefined();
  });
});
