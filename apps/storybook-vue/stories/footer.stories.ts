import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Footer, FooterBottom, FooterGrid, FooterLinks, FooterSectionTitle } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 1/Footer',
  component: Footer,
  tags: ['autodocs'],
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: renderStory(() =>
    h(Footer, {}, {
      default: () => [
        h(FooterGrid, {}, {
          default: () => [
            h('section', [
              h(FooterSectionTitle, {}, { default: () => 'Product' }),
              h(FooterLinks, {}, {
                default: () => [
                  h('li', [h('a', { href: '/components' }, 'Components')]),
                  h('li', [h('a', { href: '/tokens' }, 'Tokens')]),
                ],
              }),
            ]),
            h('section', [
              h(FooterSectionTitle, {}, { default: () => 'Company' }),
              h(FooterLinks, {}, {
                default: () => [
                  h('li', [h('a', { href: '/about' }, 'About')]),
                  h('li', [h('a', { href: '/contact' }, 'Contact')]),
                ],
              }),
            ]),
          ],
        }),
        h(FooterBottom, {}, { default: () => 'Foolscap components' }),
      ],
    }),
  ),
}
