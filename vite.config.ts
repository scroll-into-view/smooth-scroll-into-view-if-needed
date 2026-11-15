import browserslist from 'browserslist'
import { defineConfig } from 'vite-plus'

// tsdown doesn't read the `browserslist` field in package.json, so it gets the
// oldest version of each browser that the field resolves to, in the
// esbuild-style target format
const esbuildNames: Record<string, string> = {
  and_chr: 'chrome',
  and_ff: 'firefox',
  chrome: 'chrome',
  edge: 'edge',
  firefox: 'firefox',
  ios_saf: 'ios',
  opera: 'opera',
  safari: 'safari',
}
const oldest = new Map<string, number>()
for (const entry of browserslist()) {
  const [name, version] = entry.split(' ')
  const esbuildName = esbuildNames[name]
  if (!esbuildName) {
    throw new Error(`Map the browserslist name "${name}" to a tsdown target`)
  }
  // Ranges like "13.0-13.1" start with their oldest version
  const number = parseFloat(version)
  if (number < (oldest.get(esbuildName) ?? Infinity)) {
    oldest.set(esbuildName, number)
  }
}
const target = [...oldest].map(([name, version]) => `${name}${version}`)

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
    // The browserslist baseline in package.json (Baseline 2019) keeps `?.` and
    // `??` transpiled for Webpack 4 and other older toolchains. Its oldest
    // browser, Edge 18, supports ES2017 syntax but not object rest/spread or
    // optional catch binding, so `check:es` runs `es-check es2017` to enforce it.
    // es-check's checkBrowser mode can't be used instead, as it treats Edge 18 as ES5
    target,
    // Declarations come from Oxc (tsconfig enables isolatedDeclarations), so
    // no TypeScript install is needed. They have no maps, as src/ isn't
    // published for them to point at
    dts: { generator: 'oxc' },
    // Embeds src/index.ts in its sourcesContent
    sourcemap: true,
    minify: true,
    // tsdown writes `exports`, plus `main`, `module` and `types` for tools that predate `exports`
    exports: { legacy: true },
    // Fail the build on package.json/exports and type-resolution problems
    publint: true,
    attw: { profile: 'esm-only' },
  },
})
