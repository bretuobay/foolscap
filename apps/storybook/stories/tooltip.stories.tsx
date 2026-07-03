import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useRef } from 'react'
import { Button, TooltipContent, TooltipRoot, TooltipTrigger } from '@web-loom/foolscap-react'

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

function Demo({ placement }: { placement?: 'top' | 'bottom' | 'left' | 'right' }) {
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handle = window.setTimeout(() => triggerRef.current?.focus(), 50)
    return () => window.clearTimeout(handle)
  }, [])

  return (
    <TooltipRoot openDelay={0} closeDelay={0} placement={placement}>
      <TooltipTrigger>
        <Button ref={triggerRef} variant="secondary">
          Save
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Save your changes
        <span className="fc-tooltip__arrow" aria-hidden="true" />
      </TooltipContent>
    </TooltipRoot>
  )
}

export const Default: Story = {
  render: () => <Demo />,
}

export const PlacementBottom: Story = {
  name: 'Placement — bottom',
  render: () => <Demo placement="bottom" />,
}
