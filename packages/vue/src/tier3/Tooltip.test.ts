import { defineComponent, h, nextTick } from 'vue'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Button } from '../tier1/Button'
import { TooltipContent, TooltipRoot, TooltipTrigger } from './Tooltip'

const TooltipFixture = defineComponent({
  props: {
    openDelay: { type: Number, default: 0 },
    closeDelay: { type: Number, default: 0 },
  },
  setup(props) {
    return () =>
      h(TooltipRoot, { openDelay: props.openDelay, closeDelay: props.closeDelay }, {
        default: () => [
          h(TooltipTrigger, null, {
            default: () => h(Button, null, { default: () => 'Hover me' }),
          }),
          h(TooltipContent, null, {
            default: () => [
              h('span', { class: 'fc-tooltip__arrow', 'aria-hidden': 'true' }),
              'Helpful text',
            ],
          }),
        ],
      })
  },
})

function renderTooltip() {
  const result = render(TooltipFixture)
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
    await nextTick()
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
    const { trigger, root } = renderTooltip()
    await nextTick()
    await fireEvent.focus(trigger)
    await waitFor(() => expect(root).toHaveAttribute('data-state', 'open'))
    await fireEvent.blur(trigger)
    await waitFor(() => expect(root).toHaveAttribute('data-state', 'closed'))
  })

  it('closes immediately on Escape', async () => {
    const { trigger, root, content } = renderTooltip()
    await nextTick()
    await fireEvent.focus(trigger)
    await waitFor(() => {
      expect(root).toHaveAttribute('data-state', 'open')
      expect(content.style.position).toBe('fixed')
    })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await waitFor(() => expect(root).toHaveAttribute('data-state', 'closed'))
  })
})
