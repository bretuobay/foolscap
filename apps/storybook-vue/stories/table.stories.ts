import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Table } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 1/Table',
  component: Table,
  tags: ['autodocs'],
  args: {
    variant: 'striped',
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) =>
    renderStory(() =>
      h(Table, args, {
        default: () => [
          h('thead', [
            h('tr', [
              h('th', { scope: 'col' }, 'Component'),
              h('th', { scope: 'col' }, 'Tier'),
              h('th', { scope: 'col' }, 'Status'),
            ]),
          ]),
          h('tbody', [
            h('tr', [h('td', 'Alert'), h('td', '1'), h('td', 'Ready')]),
            h('tr', [h('td', 'Color Picker'), h('td', '1'), h('td', 'Queued')]),
          ]),
        ],
      }),
    )(),
}
