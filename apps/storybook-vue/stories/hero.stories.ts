import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Button, Hero, HeroActions, HeroDescription, HeroEyebrow, HeroTitle } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 1/Hero',
  component: Hero,
  tags: ['autodocs'],
  args: {
    variant: 'default',
  },
} satisfies Meta<typeof Hero>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) =>
    renderStory(() =>
      h(Hero, args, {
        default: () => [
          h(HeroEyebrow, {}, { default: () => 'Design system' }),
          h(HeroTitle, {}, { default: () => 'Composable components for product teams' }),
          h(HeroDescription, {}, {
            default: () => 'Build consistent interfaces with accessible primitives and headless machines.',
          }),
          h(HeroActions, {}, {
            default: () => [
              h(Button, {}, { default: () => 'Get started' }),
              h(Button, { variant: 'secondary' }, { default: () => 'View components' }),
            ],
          }),
        ],
      }),
    )(),
}
