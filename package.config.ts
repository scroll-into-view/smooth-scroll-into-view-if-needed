import { defineConfig } from '@sanity/pkg-utils'

export default defineConfig({
  minify: true,

  extract: {
    rules: {
      'ae-missing-release-tag': 'off',
      'ae-forgotten-export': 'off',
    },
  },
})
