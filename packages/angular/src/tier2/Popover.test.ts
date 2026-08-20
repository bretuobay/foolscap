import { fireEvent, render, screen, waitFor } from '@testing-library/angular'
import { describe, expect, it } from 'vitest'
import { Button } from '../tier1/Button'
import { PopoverContent, PopoverRoot, PopoverTrigger } from './Popover'

const popoverImports = [PopoverRoot, PopoverTrigger, PopoverContent, Button]

const popoverTemplate = `
  <fc-popover-root placement="bottom" [offset]="8">
    <button fc-button fc-popover-trigger>More info</button>
    <div fc-popover-content>
      <p>Interactive content</p>
    </div>
  </fc-popover-root>
`

async function renderPopover() {
  const result = await render(popoverTemplate, { imports: popoverImports })
  const trigger = screen.getByRole('button', { name: 'More info' })
  const content = document.body.querySelector('.fc-popover') as HTMLDivElement
  return { ...result, trigger, content }
}

describe('Popover', () => {
  it('renders closed by default', async () => {
    const { content, trigger } = await renderPopover()
    expect(content).toHaveAttribute('hidden')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens on click and wires aria-expanded to the trigger', async () => {
    const { trigger, content } = await renderPopover()
    await fireEvent.click(trigger)
    await waitFor(() => {
      expect(content).not.toHaveAttribute('hidden')
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })
  })

  it('closes immediately on Escape', async () => {
    const { trigger, content } = await renderPopover()
    await fireEvent.click(trigger)
    await waitFor(() => {
      expect(content).not.toHaveAttribute('hidden')
      expect(content.style.position).toBe('fixed')
    })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await waitFor(() => {
      expect(content).toHaveAttribute('hidden')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })
  })
})
