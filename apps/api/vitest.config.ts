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
    name: 'API UNIT',
    include: ['**/*.spec.ts'],
    exclude: ['**/*.e2e.spec.ts', 'node_modules'],
    globals: true,
    env: loadEnv('test', process.cwd(), ''),
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        ...configDefaults.exclude,
        'src/metadata.ts',
        'generate.ts',
        'test/global.setup.ts',
        'src/instrument.ts',
        'src/main.ts',
      ],
    },
    globalSetup: './src/test/unit.setup.ts',
  },
  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
    }),
  ],
});
