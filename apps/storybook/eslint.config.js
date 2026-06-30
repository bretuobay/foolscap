import base from '@foolscap/eslint-config'

export default [
  {
    ignores: ['**/storybook-static/**', '.storybook/test-runner-jest.config.js'],
  },
  ...base,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]
