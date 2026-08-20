import base from '@foolscap/eslint-config'

export default [
  {
    ignores: ['**/storybook-static/**'],
  },
  ...base,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]
