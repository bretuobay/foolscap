import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h, ref } from 'vue'
import { ProgressIndicatorRoot } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const checkoutSteps = [
  { label: 'Cart', description: 'Review items' },
  { label: 'Shipping', description: 'Delivery address' },
  { label: 'Payment', description: 'Billing details' },
  { label: 'Review', description: 'Confirm order' },
]

const meta = {
  title: 'Tier 3/Progress Indicator',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: renderStory(() =>
    h(ProgressIndicatorRoot, { steps: checkoutSteps, defaultStep: 1, label: 'Checkout steps' }),
  ),
}

export const Vertical: Story = {
  render: renderStory(() =>
    h('div', { style: { maxWidth: '18rem' } }, [
      h(ProgressIndicatorRoot, {
        steps: checkoutSteps,
        defaultStep: 2,
        orientation: 'vertical',
        label: 'Checkout steps',
      }),
    ]),
  ),
}

const NonLinearProgressIndicator = defineComponent({
  setup() {
    const step = ref(1)
    return () =>
      h(ProgressIndicatorRoot, {
        steps: checkoutSteps,
        step: step.value,
        linear: false,
        label: 'Checkout steps',
        onStepChange: (next: number) => {
          step.value = next
        },
      })
  },
})

export const NonLinear: Story = {
  name: 'Non-linear',
  render: renderStory(() => h(NonLinearProgressIndicator)),
}
