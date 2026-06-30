import base from '@foolscap/eslint-config'

export default [
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
