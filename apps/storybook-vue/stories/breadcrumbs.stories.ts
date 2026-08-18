import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { BreadcrumbItem, Breadcrumbs } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 1/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: renderStory(() =>
    h(Breadcrumbs, {}, {
      default: () => [
        h(BreadcrumbItem, {}, { default: () => h('a', { href: '/' }, 'Home') }),
        h(BreadcrumbItem, {}, { default: () => h('a', { href: '/projects' }, 'Projects') }),
        h(BreadcrumbItem, {}, {
          default: () => h('span', { 'aria-current': 'page' }, 'Atlas'),
        }),
      ],
    }),
  ),
}
