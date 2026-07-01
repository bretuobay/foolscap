import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerBody,
  DrawerFooter,
  type DrawerSide,
} from '@web-loom/foolscap-react'

const meta: Meta<typeof Drawer> = {
  title: 'Tier 3/Drawer',
  component: Drawer,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Drawer>

function DrawerDemo({
  side = 'right',
  size,
  closeOnOverlayClick = true,
}: {
  side?: DrawerSide
  size?: 'sm' | 'md' | 'lg'
  closeOnOverlayClick?: boolean
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open {side} drawer
      </button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        side={side}
        size={size}
        closeOnOverlayClick={closeOnOverlayClick}
      >
        <DrawerHeader>
          <DrawerTitle>Drawer title</DrawerTitle>
          <DrawerClose />
        </DrawerHeader>
        <DrawerBody>
          <p style={{ margin: 0 }}>
            This is the drawer body. It scrolls independently when content overflows.
          </p>
          <ul style={{ marginTop: '1rem', paddingLeft: '1.25rem' }}>
            {Array.from({ length: 8 }, (_, i) => (
              <li key={i} style={{ marginBottom: '0.5rem' }}>
                List item {i + 1}
              </li>
            ))}
          </ul>
        </DrawerBody>
        <DrawerFooter>
          <button type="button" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button type="button" onClick={() => setOpen(false)}>
            Save changes
          </button>
        </DrawerFooter>
      </Drawer>
    </>
  )
}

export const Default: Story = {
  render: () => <DrawerDemo side="right" />,
}

export const LeftSide: Story = {
  render: () => <DrawerDemo side="left" />,
}

export const TopSide: Story = {
  render: () => <DrawerDemo side="top" />,
}

export const BottomSide: Story = {
  render: () => <DrawerDemo side="bottom" />,
}

export const Small: Story = {
  render: () => <DrawerDemo side="right" size="sm" />,
  name: 'Size: sm',
}

export const Large: Story = {
  render: () => <DrawerDemo side="right" size="lg" />,
  name: 'Size: lg',
}

export const NoOverlayClose: Story = {
  render: () => <DrawerDemo side="right" closeOnOverlayClick={false} />,
  name: 'No overlay click to close',
}

export const AllSides: Story = {
  render: () => {
    const sides: DrawerSide[] = ['right', 'left', 'top', 'bottom']
    return (
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {sides.map((side) => (
          <DrawerDemo key={side} side={side} />
        ))}
      </div>
    )
  },
}
