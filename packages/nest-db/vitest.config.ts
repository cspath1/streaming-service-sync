import swc from 'unplugin-swc';
import { configDefaults, defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

/**
 * @description Vitest configuration
 * @see https://vitest.dev/config
 * @see https://docs.nestjs.com/recipes/swc
 */

export default defineConfig({
  test: {
    include: ['**/*.spec.ts'],
    globals: true,
    env: loadEnv('test', process.cwd(), ''),
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        ...configDefaults.exclude,
        'src/metadata.ts',
        'generate.ts',
        'test/global.setup.ts',
      ],
    },
    globalSetup: './test/global.setup.ts',
  },
  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
    }) as any,
  ],
});
