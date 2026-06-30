import type { TestRunnerConfig } from '@storybook/test-runner'
import AxeBuilder from '@axe-core/playwright'

const config: TestRunnerConfig = {
  async postVisit(page) {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#storybook-root')
      .analyze()

    if (accessibilityScanResults.violations.length > 0) {
      throw new Error(JSON.stringify(accessibilityScanResults.violations, null, 2))
    }
  },
}

export default config
