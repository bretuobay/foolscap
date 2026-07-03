import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Button, PopoverClose, PopoverContent, PopoverRoot, PopoverTrigger } from '@web-loom/foolscap-react'

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

const stageStyle: CSSProperties = {
  height: '360px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const contentStyle: CSSProperties = {
  gap: '0.75rem',
}

function Demo({ placement }: { placement?: 'top' | 'bottom' | 'left' | 'right' }) {
  return (
    <div style={stageStyle}>
      <PopoverRoot placement={placement ?? 'bottom'}>
        <PopoverTrigger>
          <Button variant="secondary" size="sm">
            Open popover
          </Button>
        </PopoverTrigger>
        <PopoverContent style={contentStyle} aria-label="Additional information">
          <div style={{ display: 'grid', gap: '0.25rem' }}>
            <strong style={{ fontSize: '0.875rem' }}>Popover content</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.5 }}>
              This popover can hold interactive controls, not just plain text.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <PopoverClose>
              <Button size="sm">Action</Button>
            </PopoverClose>
            <PopoverClose>
              <Button size="sm" variant="ghost">
                Dismiss
              </Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </PopoverRoot>
    </div>
  )
}

export const Default: Story = {
  render: () => <Demo />,
}

export const PlacementTop: Story = {
  name: 'Placement — top',
  render: () => <Demo placement="top" />,
}

export const PlacementLeft: Story = {
  name: 'Placement — left',
  render: () => <Demo placement="left" />,
}

export const PlacementRight: Story = {
  name: 'Placement — right',
  render: () => <Demo placement="right" />,
}
