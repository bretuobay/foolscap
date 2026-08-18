import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Fieldset, TextInput } from '@web-loom/foolscap-vue'

const meta = {
  title: 'Tier 1/Fieldset',
  component: Fieldset,
  tags: ['autodocs'],
  args: {
    legend: 'Profile',
    hint: 'These details are visible to collaborators.',
  },
} satisfies Meta<typeof Fieldset>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    setup() {
      return () =>
        h(Fieldset, args, {
          default: () => [
            h(TextInput, { 'aria-label': 'Display name', placeholder: 'Display name' }),
            h(TextInput, { 'aria-label': 'Role', placeholder: 'Role' }),
          ],
        })
    },
  }),
}
