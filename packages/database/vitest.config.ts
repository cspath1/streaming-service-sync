import { configDefaults, defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

/**
 * @description Vitest configuration
 * @see https://vitest.dev/config
 * @see https://docs.nestjs.com/recipes/swc
 */

export default defineConfig({
  test: {
    name: 'NEST DB',
    include: ['**/*.spec.ts'],
    globals: true,
    env: loadEnv('test', process.cwd(), ''),
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [...configDefaults.exclude, 'src/metadata.ts', 'generate.ts'],
    },
  },
});
