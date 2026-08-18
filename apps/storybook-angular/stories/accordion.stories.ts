import type { Meta, StoryObj } from '@storybook/angular'
import {
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
} from '@web-loom/foolscap-angular'

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

const accordionImports = [AccordionRoot, AccordionItem, AccordionTrigger, AccordionPanel]

function accordionTemplate(type: 'single' | 'multiple') {
  return `
    <div style="max-width:480px">
      <fc-accordion type="${type}">
        <details fc-accordion-item value="one">
          <summary fc-accordion-trigger>What is Foolscap?</summary>
          <div fc-accordion-panel>
            A portable design system that works without JavaScript using semantic HTML and CSS.
          </div>
        </details>
        <details fc-accordion-item value="two">
          <summary fc-accordion-trigger>Why semantic HTML first?</summary>
          <div fc-accordion-panel>
            Accessibility and progressive enhancement come for free when you start with correct markup.
          </div>
        </details>
        <details fc-accordion-item value="three">
          <summary fc-accordion-trigger>Can I use it with any framework?</summary>
          <div fc-accordion-panel>
            Yes - React, Vue, and Angular adapters are all planned. The CSS layer works standalone too.
          </div>
        </details>
      </fc-accordion>
    </div>
  `
}

export const Single: Story = {
  name: 'Single (default)',
  render: () => ({
    moduleMetadata: { imports: accordionImports },
    template: accordionTemplate('single'),
  }),
}

export const Multiple: Story = {
  name: 'Multiple',
  render: () => ({
    moduleMetadata: { imports: accordionImports },
    template: accordionTemplate('multiple'),
  }),
}
