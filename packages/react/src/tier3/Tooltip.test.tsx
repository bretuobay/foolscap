import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Button } from '../tier1/Button'
import { TooltipContent, TooltipRoot, TooltipTrigger } from './Tooltip'

function renderTooltip(props: Partial<React.ComponentProps<typeof TooltipRoot>> = {}) {
  const result = render(
    <TooltipRoot openDelay={0} closeDelay={0} {...props}>
      <TooltipTrigger>
        <Button>Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <span className="fc-tooltip__arrow" aria-hidden="true" />
        Helpful text
      </TooltipContent>
    </TooltipRoot>
  )

  const trigger = screen.getByRole('button', { name: 'Hover me' })
  const root = document.body.querySelector('.fc-tooltip') as HTMLDivElement
  const content = document.body.querySelector('.fc-tooltip__content') as HTMLDivElement

  return { ...result, trigger, root, content }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('Tooltip', () => {
  it('renders closed by default', () => {
    const { root, content } = renderTooltip()

    expect(root).toHaveAttribute('data-state', 'closed')
    expect(content).toHaveAttribute('hidden')
  })

  it('opens on hover and wires aria-describedby to the trigger', async () => {
    const { trigger, root, content } = renderTooltip()

    fireEvent.mouseEnter(trigger)

    await waitFor(() => {
      expect(root).toHaveAttribute('data-state', 'open')
      expect(content).not.toHaveAttribute('hidden')
      expect(trigger).toHaveAttribute('aria-describedby', content.id)
      expect(content.parentElement).toBe(document.body)
    })
  })

  it('closes on blur', async () => {
    const { trigger, root } = renderTooltip()

    fireEvent.focus(trigger)

    await waitFor(() => expect(root).toHaveAttribute('data-state', 'open'))

    fireEvent.blur(trigger)

    await waitFor(() => expect(root).toHaveAttribute('data-state', 'closed'))
  })

  it('closes immediately on Escape', async () => {
    const { trigger, root } = renderTooltip()

    fireEvent.focus(trigger)

    await waitFor(() => expect(root).toHaveAttribute('data-state', 'open'))

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    await waitFor(() => expect(root).toHaveAttribute('data-state', 'closed'))
  })
})
