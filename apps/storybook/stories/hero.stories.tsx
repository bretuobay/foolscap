import type { Meta, StoryObj } from '@storybook/react'
import { Button, Hero, HeroActions, HeroDescription, HeroEyebrow, HeroTitle } from '@web-loom/foolscap-react'

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
  render: (args) => (
    <Hero {...args}>
      <HeroEyebrow>Design system</HeroEyebrow>
      <HeroTitle>Composable components for product teams</HeroTitle>
      <HeroDescription>Build consistent interfaces with accessible primitives and headless machines.</HeroDescription>
      <HeroActions>
        <Button>Get started</Button>
        <Button variant="secondary">View components</Button>
      </HeroActions>
    </Hero>
  ),
}
