import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 2/Accordion',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { story: { height: '420px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

function Demo(type?: 'single' | 'multiple') {
  return h('div', { style: { maxWidth: '480px' } }, [
    h(AccordionRoot, { type }, {
      default: () => [
        h(AccordionItem, { value: 'one' }, {
          default: () => [
            h(AccordionTrigger, null, { default: () => 'What is Foolscap?' }),
            h(AccordionPanel, null, {
              default: () =>
                'A portable design system that works without JavaScript using semantic HTML and CSS.',
            }),
          ],
        }),
        h(AccordionItem, { value: 'two' }, {
          default: () => [
            h(AccordionTrigger, null, { default: () => 'Why semantic HTML first?' }),
            h(AccordionPanel, null, {
              default: () =>
                'Accessibility and progressive enhancement come for free when you start with correct markup.',
            }),
          ],
        }),
        h(AccordionItem, { value: 'three' }, {
          default: () => [
            h(AccordionTrigger, null, { default: () => 'Can I use it with any framework?' }),
            h(AccordionPanel, null, {
              default: () =>
                'Yes - React, Vue, and Angular adapters are all planned. The CSS layer works standalone too.',
            }),
          ],
        }),
      ],
    }),
  ])
}

export const Single: Story = {
  name: 'Single (default)',
  render: renderStory(() => Demo('single')),
}

export const Multiple: Story = {
  name: 'Multiple',
  render: renderStory(() => Demo('multiple')),
}
