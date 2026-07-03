import type { Meta, StoryObj } from '@storybook/react'
import { Slider } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Volume',
    min: 0,
    max: 100,
    defaultValue: 40,
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
