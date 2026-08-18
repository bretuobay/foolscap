import base from '@foolscap/eslint-config'

export default [
  {
    ignores: ['**/storybook-static/**'],
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
