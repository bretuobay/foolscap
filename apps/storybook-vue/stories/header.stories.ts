import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Button, Header, HeaderActions, HeaderBrand, HeaderNav } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 1/Header',
  component: Header,
  tags: ['autodocs'],
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: renderStory(() =>
    h(Header, {}, {
      default: () => [
        h(HeaderBrand, { href: '/' }, { default: () => 'Foolscap' }),
        h(HeaderNav, { 'aria-label': 'Primary' }, {
          default: () => [
            h('a', { href: '/docs', 'aria-current': 'page' }, 'Docs'),
            h('a', { href: '/components' }, 'Components'),
          ],
        }),
        h(HeaderActions, {}, {
          default: () => h(Button, { variant: 'secondary' }, { default: () => 'Sign in' }),
        }),
      ],
    }),
  ),
}
