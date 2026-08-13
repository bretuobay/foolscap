import { defineComponent, h, nextTick } from 'vue'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { Button } from '../tier1/Button'
import { PopoverContent, PopoverRoot, PopoverTrigger } from './Popover'

const PopoverFixture = defineComponent({
  setup() {
    return () =>
      h(PopoverRoot, { placement: 'bottom', offset: 8 }, {
        default: () => [
          h(PopoverTrigger, null, {
            default: () => h(Button, null, { default: () => 'More info' }),
          }),
          h(PopoverContent, null, {
            default: () => h('p', null, 'Interactive content'),
          }),
        ],
      })
  },
})

function renderPopover() {
  const result = render(PopoverFixture)
  const trigger = screen.getByRole('button', { name: 'More info' })
  const content = document.body.querySelector('.fc-popover') as HTMLDivElement
  return { ...result, trigger, content }
}

describe('Popover', () => {
  it('renders closed by default', () => {
    const { content, trigger } = renderPopover()
    expect(content).toHaveAttribute('hidden')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens on click and wires aria-expanded to the trigger', async () => {
    const { trigger, content } = renderPopover()
    await nextTick()
    await fireEvent.click(trigger)
    await waitFor(() => {
      expect(content).not.toHaveAttribute('hidden')
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })
  })

  it('closes immediately on Escape', async () => {
    const { trigger, content } = renderPopover()
    await nextTick()
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
