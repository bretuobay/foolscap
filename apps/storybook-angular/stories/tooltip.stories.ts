import type { Meta, StoryObj } from '@storybook/angular'
import { Button, TooltipContent, TooltipRoot, TooltipTrigger } from '@web-loom/foolscap-angular'

const tooltipImports = [TooltipRoot, TooltipTrigger, TooltipContent, Button]

const meta = {
  title: 'Tier 3/Tooltip',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { story: { height: '200px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

function tooltipTemplate(placement?: string) {
  const placementAttr = placement ? `placement="${placement}"` : ''
  return `
    <fc-tooltip-root [openDelay]="0" [closeDelay]="0" ${placementAttr}>
      <button fc-button fc-tooltip-trigger variant="secondary">Save</button>
      <div fc-tooltip-content>
        Save your changes
        <span class="fc-tooltip__arrow" aria-hidden="true"></span>
      </div>
    </fc-tooltip-root>
  `
}

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: tooltipImports },
    template: tooltipTemplate(),
  }),
}

export const PlacementBottom: Story = {
  name: 'Placement — bottom',
  render: () => ({
    moduleMetadata: { imports: tooltipImports },
    template: tooltipTemplate('bottom'),
  }),
}
