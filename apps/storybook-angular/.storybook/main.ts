import type { StorybookConfig } from '@analogjs/storybook-angular'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: {
    name: '@analogjs/storybook-angular',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
}

export default config
