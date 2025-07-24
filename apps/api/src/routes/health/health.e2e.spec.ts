import request from 'supertest';
import { describe, inject, it } from 'vitest';

/**
 * E2E Test Suite for Health Routes
 */

describe.skipIf(inject('SKIP_E2E'))('Health', () => {
  const app = inject('app');

  it('should return 200 on GET /health', () => {
    return request(app)
      .get('/health')
      .expect(200)
      .expect('Content-Type', /json/);
  });
});
