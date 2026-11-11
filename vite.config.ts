import { defineConfig } from 'vite-plus'

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
  },
  fmt: {
    semi: false,
    singleQuote: true,
    trailingComma: 'es5',
    printWidth: 80,
    sortPackageJson: false,
    ignorePatterns: ['node_modules', 'package.json'],
  },
  test: {
    // Jest 26 ran these tests in jsdom by default
    environment: 'jsdom',
  },
  pack: {
    entry: ['src/index.ts'],
    // Emit dist/index.js (ESM) and dist/index.cjs (CJS) to match package.json exports.
    // package.json points both conditions at dist/index.d.ts, so skip an unused index.d.cts.
    format: { esm: {}, cjs: { dts: false } },
    platform: 'neutral',
    // The targets that @sanity/pkg-utils previously resolved from its
    // browserslist query (tsdown would otherwise target engines.node)
    target: [
      'chrome109',
      'edge154',
      'firefox157',
      'ios16',
      'opera136',
      'safari17',
      'node22',
    ],
    // Declarations come from Oxc (tsconfig enables isolatedDeclarations), so
    // no TypeScript install is needed. Without sourcemap the .d.ts files would
    // reference .d.ts.map files that are not emitted.
    dts: { generator: 'oxc', sourcemap: true },
    sourcemap: true,
    minify: true,
    // Keep the "use strict" directive that the previous CommonJS output had
    outputOptions: { strict: true },
  },
})
