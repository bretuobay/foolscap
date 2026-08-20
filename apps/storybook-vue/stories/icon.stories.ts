import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Icon } from '@web-loom/foolscap-vue'

const meta = {
  title: 'Tier 1/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: {
    label: 'Status',
    size: 'md',
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Status',
    size: 'md',
  },
  render: (args) => ({
    setup() {
      return () =>
        h(Icon, args, {
          default: () =>
            h('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, [
              h('circle', { cx: '12', cy: '12', r: '8' }),
            ]),
        })
    },
  }),
}
