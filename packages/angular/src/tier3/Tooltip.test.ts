import { fireEvent, render, screen, waitFor } from '@testing-library/angular'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Button } from '../tier1/Button'
import { TooltipContent, TooltipRoot, TooltipTrigger } from './Tooltip'

const tooltipImports = [TooltipRoot, TooltipTrigger, TooltipContent, Button]

const tooltipTemplate = `
  <fc-tooltip-root [openDelay]="0" [closeDelay]="0">
    <button fc-button fc-tooltip-trigger>Hover me</button>
    <div fc-tooltip-content>
      <span class="fc-tooltip__arrow" aria-hidden="true"></span>
      Helpful text
    </div>
  </fc-tooltip-root>
`

async function renderTooltip() {
  const result = await render(tooltipTemplate, { imports: tooltipImports })
  const trigger = screen.getByRole('button', { name: 'Hover me' })
  const root = document.body.querySelector('.fc-tooltip') as HTMLDivElement
  const content = document.body.querySelector('.fc-tooltip__content') as HTMLDivElement
  return { ...result, trigger, root, content }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('Tooltip', () => {
  it('renders closed by default', async () => {
    const { root, content } = await renderTooltip()
    expect(root).toHaveAttribute('data-state', 'closed')
    expect(content).toHaveAttribute('hidden')
  })

  it('opens on hover and wires aria-describedby to the trigger', async () => {
    const { trigger, root, content } = await renderTooltip()
    await fireEvent.mouseOver(trigger)
    trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true }))
    await waitFor(() => {
      expect(root).toHaveAttribute('data-state', 'open')
      expect(content).not.toHaveAttribute('hidden')
      expect(trigger).toHaveAttribute('aria-describedby', content.id)
      expect(content.parentElement).toBe(document.body)
    })
  })

  it('closes on blur', async () => {
    const { trigger, root } = await renderTooltip()
    await fireEvent.focus(trigger)
    await waitFor(() => expect(root).toHaveAttribute('data-state', 'open'))
    await fireEvent.blur(trigger)
    await waitFor(() => expect(root).toHaveAttribute('data-state', 'closed'))
  })

  it('closes immediately on Escape', async () => {
    const { trigger, root, content } = await renderTooltip()
    await fireEvent.focus(trigger)
    await waitFor(() => {
      expect(root).toHaveAttribute('data-state', 'open')
      expect(content.style.position).toBe('fixed')
    })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await waitFor(() => expect(root).toHaveAttribute('data-state', 'closed'))
  })
})
