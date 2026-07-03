import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ProgressIndicatorRoot } from '@web-loom/foolscap-react'

const checkoutSteps = [
  { label: 'Cart', description: 'Review items' },
  { label: 'Shipping', description: 'Delivery address' },
  { label: 'Payment', description: 'Billing details' },
  { label: 'Review', description: 'Confirm order' },
]

const meta = {
  title: 'React/Progress Indicator',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <ProgressIndicatorRoot steps={checkoutSteps} defaultStep={1} label="Checkout steps" />,
}

export const Vertical: Story = {
  render: () => (
    <div style={{ maxWidth: '18rem' }}>
      <ProgressIndicatorRoot
        steps={checkoutSteps}
        defaultStep={2}
        orientation="vertical"
        label="Checkout steps"
      />
    </div>
  ),
}

export const NonLinear: Story = {
  name: 'Non-linear',
  render: function NonLinearProgressIndicator() {
    const [step, setStep] = useState(1)
    return (
      <ProgressIndicatorRoot
        steps={checkoutSteps}
        step={step}
        linear={false}
        label="Checkout steps"
        onStepChange={setStep}
      />
    )
  },
}
