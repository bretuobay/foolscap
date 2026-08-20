import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h, ref } from 'vue'
import { TabsRoot, TabsList, Tab, TabPanel } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 3/Tabs',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { story: { height: '220px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

function Demo(props: {
  defaultValue?: string
  value?: string
  variant?: 'underline' | 'contained'
  orientation?: 'horizontal' | 'vertical'
  onValueChange?: (value: string) => void
}) {
  return h('div', { style: { maxWidth: '480px' } }, [
    h(TabsRoot, props, {
      default: () => [
        h(TabsList, null, {
          default: () => [
            h(Tab, { value: 'overview' }, { default: () => 'Overview' }),
            h(Tab, { value: 'specs' }, { default: () => 'Specifications' }),
            h(Tab, { value: 'reviews' }, { default: () => 'Reviews' }),
          ],
        }),
        h(TabPanel, { value: 'overview' }, {
          default: () =>
            h('p', null, 'A complete overview of the product, including key features and benefits.'),
        }),
        h(TabPanel, { value: 'specs' }, {
          default: () =>
            h('ul', null, [
              h('li', null, 'Weight: 1.2 kg'),
              h('li', null, 'Dimensions: 30 x 20 x 5 cm'),
              h('li', null, 'Material: Recycled aluminium'),
            ]),
        }),
        h(TabPanel, { value: 'reviews' }, {
          default: () => h('p', null, '⭐⭐⭐⭐⭐ - "Exactly what I needed." - Alex M.'),
        }),
      ],
    }),
  ])
}

export const Default: Story = {
  render: renderStory(() => Demo({ defaultValue: 'overview' })),
}

export const Underline: Story = {
  render: renderStory(() => Demo({ defaultValue: 'overview', variant: 'underline' })),
}

export const Contained: Story = {
  render: renderStory(() => Demo({ defaultValue: 'overview', variant: 'contained' })),
}

export const Vertical: Story = {
  render: renderStory(() =>
    h('div', { style: { maxWidth: '600px' } }, [
      h(TabsRoot, { defaultValue: 'overview', orientation: 'vertical' }, {
        default: () => [
          h(TabsList, null, {
            default: () => [
              h(Tab, { value: 'overview' }, { default: () => 'Overview' }),
              h(Tab, { value: 'specs' }, { default: () => 'Specifications' }),
              h(Tab, { value: 'reviews' }, { default: () => 'Reviews' }),
            ],
          }),
          h(TabPanel, { value: 'overview' }, { default: () => 'Overview content' }),
          h(TabPanel, { value: 'specs' }, { default: () => 'Specs content' }),
          h(TabPanel, { value: 'reviews' }, { default: () => 'Reviews content' }),
        ],
      }),
    ]),
  ),
}

const ControlledDemo = defineComponent({
  setup() {
    const tab = ref('overview')
    return () =>
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '0.5rem' } }, [
        Demo({
          value: tab.value,
          onValueChange: (value: string) => {
            tab.value = value
          },
        }),
        h(
          'p',
          { style: { margin: 0, fontSize: '0.875rem', color: 'var(--fc-color-text-muted, #666)' } },
          ['Active: ', h('strong', null, tab.value)],
        ),
      ])
  },
})

export const Controlled: Story = {
  render: renderStory(() => h(ControlledDemo)),
}
