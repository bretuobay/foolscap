import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h, ref } from 'vue'
import { RatingRoot } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 3/Rating',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: renderStory(() => h(RatingRoot, { defaultValue: 3, name: 'rating' })),
}

const ControlledRating = defineComponent({
  setup() {
    const value = ref(3)
    return () =>
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' } },
        [
          h(RatingRoot, {
            value: value.value,
            onValueChange: (next: number) => {
              value.value = next
            },
          }),
          h(
            'p',
            { style: { margin: 0, fontSize: '0.875rem', color: 'var(--fc-ink-muted, rgb(26 26 26 / 0.68))' } },
            ['Rating: ', h('strong', null, String(value.value))],
          ),
        ],
      )
  },
})

export const Controlled: Story = {
  render: renderStory(() => h(ControlledRating)),
}

export const ReadOnly: Story = {
  name: 'Read only',
  render: renderStory(() => h(RatingRoot, { value: 4, readOnly: true })),
}

export const Disabled: Story = {
  render: renderStory(() => h(RatingRoot, { defaultValue: 2, disabled: true })),
}

export const CustomMax: Story = {
  name: 'Custom max',
  render: renderStory(() => h(RatingRoot, { max: 10, defaultValue: 7 })),
}
