import type { Meta, StoryObj } from '@storybook/react'
import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from '@web-loom/foolscap-react'

const meta = {
  title: 'React/Accordion',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj

function Demo({ type }: { type?: 'single' | 'multiple' }) {
  return (
    <div style={{ maxWidth: '480px' }}>
      <AccordionRoot type={type}>
        <AccordionItem value="one">
          <AccordionTrigger>What is Foolscap?</AccordionTrigger>
          <AccordionPanel>
            A portable design system that works without JavaScript using semantic HTML and CSS.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="two">
          <AccordionTrigger>Why semantic HTML first?</AccordionTrigger>
          <AccordionPanel>
            Accessibility and progressive enhancement come for free when you start with correct
            markup.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="three">
          <AccordionTrigger>Can I use it with any framework?</AccordionTrigger>
          <AccordionPanel>
            Yes - React, Vue, and Angular adapters are all planned. The CSS layer works standalone
            too.
          </AccordionPanel>
        </AccordionItem>
      </AccordionRoot>
    </div>
  )
}

export const Single: Story = {
  name: 'Single (default)',
  render: () => <Demo type="single" />,
}

export const Multiple: Story = {
  name: 'Multiple',
  render: () => <Demo type="multiple" />,
}
