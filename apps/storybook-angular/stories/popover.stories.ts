import type { Meta, StoryObj } from '@storybook/angular'
import {
  Button,
  PopoverClose,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from '@web-loom/foolscap-angular'

const meta = {
  title: 'Tier 2/Popover',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { story: { height: '400px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

const popoverImports = [PopoverRoot, PopoverTrigger, PopoverContent, PopoverClose, Button]

function popoverTemplate(placement: 'top' | 'bottom' | 'left' | 'right') {
  return `
    <div style="height:360px;display:flex;align-items:center;justify-content:center">
      <fc-popover-root placement="${placement}">
        <button fc-button fc-popover-trigger variant="secondary" size="sm">Open popover</button>
        <div fc-popover-content aria-label="Additional information" style="gap:0.75rem">
          <div style="display:grid;gap:0.25rem">
            <strong style="font-size:0.875rem">Popover content</strong>
            <p style="margin:0;font-size:0.875rem;line-height:1.5">
              This popover can hold interactive controls, not just plain text.
            </p>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            <button fc-button fc-popover-close size="sm">Action</button>
            <button fc-button fc-popover-close size="sm" variant="ghost">Dismiss</button>
          </div>
        </div>
      </fc-popover-root>
    </div>
  `
}

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: popoverImports },
    template: popoverTemplate('bottom'),
  }),
}

export const PlacementTop: Story = {
  name: 'Placement — top',
  render: () => ({
    moduleMetadata: { imports: popoverImports },
    template: popoverTemplate('top'),
  }),
}

export const PlacementLeft: Story = {
  name: 'Placement — left',
  render: () => ({
    moduleMetadata: { imports: popoverImports },
    template: popoverTemplate('left'),
  }),
}

export const PlacementRight: Story = {
  name: 'Placement — right',
  render: () => ({
    moduleMetadata: { imports: popoverImports },
    template: popoverTemplate('right'),
  }),
}
