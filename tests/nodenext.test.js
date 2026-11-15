import { execFileSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { expect, test } from 'vite-plus/test'

const repoRoot = process.cwd()

// https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/issues/1039
test('a NodeNext consumer can call the default export', () => {
  const require = createRequire(join(repoRoot, 'package.json'))
  const tsc = join(
    dirname(
      require.resolve('typescript/package.json', {
        paths: [dirname(require.resolve('@arethetypeswrong/core'))],
      })
    ),
    'bin/tsc'
  )
  if (!existsSync(join(repoRoot, 'dist/index.d.ts'))) {
    execFileSync(join(repoRoot, 'node_modules/.bin/vp'), ['pack'], {
      cwd: repoRoot,
    })
  }

  const dir = mkdtempSync(join(tmpdir(), 'nodenext-'))
  mkdirSync(join(dir, 'node_modules'))
  symlinkSync(
    repoRoot,
    join(dir, 'node_modules/smooth-scroll-into-view-if-needed'),
    process.platform === 'win32' ? 'junction' : 'dir'
  )
  writeFileSync(
    join(dir, 'package.json'),
    JSON.stringify({ name: 'nodenext-consumer', type: 'module' })
  )
  writeFileSync(
    join(dir, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        module: 'nodenext',
        moduleResolution: 'nodenext',
        strict: true,
        noEmit: true,
        skipLibCheck: true,
      },
      files: ['index.ts'],
    })
  )
  writeFileSync(
    join(dir, 'index.ts'),
    [
      "import scrollIntoView from 'smooth-scroll-into-view-if-needed'",
      'export const scroll = (el: Element) => scrollIntoView(el)',
      '',
    ].join('\n')
  )

  let errors = ''
  try {
    execFileSync(process.execPath, [tsc, '--pretty', 'false'], { cwd: dir })
  } catch (caught) {
    errors = caught.stderr ? caught.stderr.toString() : String(caught)
  }
  expect(errors).toBe('')
})
