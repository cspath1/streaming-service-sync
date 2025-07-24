import swc from 'unplugin-swc';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

/**
 * @description Vitest E2E configuration
 * @see https://vitest.dev/config
 * @see https://docs.nestjs.com/recipes/swc
 */
export default defineConfig({
  test: {
    name: 'E2E',
    include: ['**/*.e2e.spec.ts'],
    // root: './apps/api/',
    globals: true,
    env: loadEnv('test', process.cwd(), ''),
    testTimeout: 15000,
    globalSetup: ['./src/test/e2e.setup.ts'],
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }) as any,
  ],
});
