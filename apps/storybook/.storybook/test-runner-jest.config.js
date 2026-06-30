const { getJestConfig } = require('@storybook/test-runner')

const testRunnerConfig = getJestConfig()
const executablePath = process.env.FOOLSCAP_CHROMIUM_PATH

module.exports = {
  ...testRunnerConfig,
  testEnvironmentOptions: {
    ...testRunnerConfig.testEnvironmentOptions,
    'jest-playwright': {
      ...testRunnerConfig.testEnvironmentOptions?.['jest-playwright'],
      browsers: ['chromium'],
      launchOptions: {
        ...testRunnerConfig.testEnvironmentOptions?.['jest-playwright']?.launchOptions,
        ...(executablePath ? { executablePath } : {}),
      },
    },
  },
}
