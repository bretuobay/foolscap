import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { SearchInput } from '@web-loom/foolscap-vue'

const meta = {
  title: 'Tier 1/Search Input',
  component: SearchInput,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Search projects',
    placeholder: 'Search projects',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  args: {
    'aria-label': 'Search projects',
    placeholder: 'Search projects',
  },
  render: (args) => ({
    setup() {
      return () => h(SearchInput, args)
    },
  }),
}
