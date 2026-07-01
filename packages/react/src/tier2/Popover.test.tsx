import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Button } from '../tier1/Button'
import { PopoverContent, PopoverRoot, PopoverTrigger } from './Popover'

function renderPopover(props: Partial<React.ComponentProps<typeof PopoverRoot>> = {}) {
  const result = render(
    <PopoverRoot placement="bottom" offset={8} {...props}>
      <PopoverTrigger>
        <Button>More info</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>Interactive content</p>
      </PopoverContent>
    </PopoverRoot>
  )

  const trigger = screen.getByRole('button', { name: 'More info' })
  const content = document.body.querySelector('.fc-popover') as HTMLDivElement

  return { ...result, trigger, content }
}

afterEach(() => {
  cleanup()
})

describe('Popover', () => {
  it('renders closed by default', () => {
    const { content, trigger } = renderPopover()

    expect(content).toHaveAttribute('hidden')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens on click and wires aria-expanded to the trigger', async () => {
    const { trigger, content } = renderPopover()

    fireEvent.click(trigger)

    await waitFor(() => {
      expect(content).not.toHaveAttribute('hidden')
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })
  })

  it('renders the content in document.body', async () => {
    const { trigger, content } = renderPopover()

    fireEvent.click(trigger)

    await waitFor(() => {
      expect(content.parentElement).not.toBeNull()
      expect(content.parentElement?.closest('.fc-popover')).toBeNull()
    })
  })

  it('closes immediately on Escape', async () => {
    const { trigger, content } = renderPopover()

    fireEvent.click(trigger)

    await waitFor(() => expect(content).not.toHaveAttribute('hidden'))

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    await waitFor(() => {
      expect(content).toHaveAttribute('hidden')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })
  })
})
