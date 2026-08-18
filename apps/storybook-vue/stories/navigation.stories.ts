import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h, ref } from 'vue'
import { NavigationRoot, type NavigationItem } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 3/Navigation',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { story: { height: '320px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

const ITEMS: NavigationItem[] = [
  { label: 'Home', href: '/', current: true },
  {
    label: 'Products',
    children: [
      { label: 'Analytics', href: '/products/analytics' },
      { label: 'Automation', href: '/products/automation' },
      { label: 'Reports', href: '/products/reports' },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
]

export const Default: Story = {
  render: renderStory(() => h(NavigationRoot, { items: ITEMS, label: 'Main navigation' })),
}

export const Vertical: Story = {
  render: renderStory(() =>
    h('div', { style: { width: '16rem' } }, [
      h(NavigationRoot, { items: ITEMS, orientation: 'vertical', label: 'Section navigation' }),
    ]),
  ),
}

const ToggleEventsDemo = defineComponent({
  setup() {
    const message = ref('No navigation event yet')
    return () =>
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '1rem' } }, [
        h(NavigationRoot, {
          items: ITEMS,
          onToggle: ({ index, isOpen }: { index: number | null; isOpen: boolean }) => {
            message.value = `Submenu ${index ?? '-'} ${isOpen ? 'opened' : 'closed'}`
          },
          onMobileToggle: ({ isExpanded }: { isExpanded: boolean }) => {
            message.value = `Mobile navigation ${isExpanded ? 'expanded' : 'collapsed'}`
          },
        }),
        h(
          'p',
          { style: { margin: 0, fontSize: '0.875rem', color: 'var(--fc-ink-muted, rgb(26 26 26 / 0.68))' } },
          message.value,
        ),
      ])
  },
})

export const ToggleEvents: Story = {
  name: 'Toggle events',
  render: renderStory(() => h(ToggleEventsDemo)),
}
