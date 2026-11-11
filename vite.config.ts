import { defineConfig } from 'vite-plus'

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    // Listing plugins replaces Oxlint's defaults (eslint, typescript, unicorn, oxc), so they're repeated here
    plugins: [
      'eslint',
      'typescript',
      'unicorn',
      'oxc',
      'import',
      'promise',
      'vitest',
      'jsdoc',
    ],
    // Whole categories, so rules that new Vite+/Oxlint releases add to them apply automatically
    categories: { correctness: 'error', suspicious: 'error', perf: 'error' },
    rules: {
      'vite-plus/prefer-vite-plus-imports': 'error',
      'typescript/switch-exhaustiveness-check': 'error',
    },
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
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      // The coverage when this was added, so CI fails if it drops
      thresholds: { statements: 100, branches: 95, functions: 100, lines: 100 },
    },
  },
  pack: {
    entry: ['src/index.ts'],
    format: 'esm',
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
    // no TypeScript install is needed
    dts: { generator: 'oxc', sourcemap: true },
    sourcemap: true,
    minify: true,
    // tsdown writes `exports`, plus `main`, `module` and `types` for tools that predate `exports`
    exports: { legacy: true },
    // Fail the build on package.json/exports and type-resolution problems
    publint: true,
    attw: { profile: 'esm-only' },
  },
})
