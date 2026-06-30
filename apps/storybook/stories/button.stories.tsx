import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Foolscap/Button',
  parameters: {
    docs: {
      description: {
        component:
          'Class-based button markup using the Foolscap CSS layer. React adapters will replace this with package components in Phase 3.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
      <button className="fc-button" data-variant="primary" type="button">
        Primary
      </button>
      <button className="fc-button" data-variant="secondary" type="button">
        Secondary
      </button>
      <button className="fc-button" data-variant="ghost" type="button">
        Ghost
      </button>
      <button className="fc-button" disabled type="button">
        Disabled
      </button>
    </div>
  ),
}
