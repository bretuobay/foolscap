import { defineComponent, h, nextTick, type PropType } from 'vue'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { AccordionItem, AccordionPanel, AccordionRoot, AccordionTrigger } from './Accordion'

function toggle(detailsEl: HTMLDetailsElement, open: boolean) {
  detailsEl.open = open
  detailsEl.dispatchEvent(new Event('toggle'))
}

function getDetails(label: string): HTMLDetailsElement {
  return screen.getByText(label).closest('details') as HTMLDetailsElement
}

const AccordionFixture = defineComponent({
  props: {
    type: { type: String, default: 'single' },
    className: { type: String, default: undefined },
    onValueChange: { type: Function as PropType<(value: string | string[]) => void>, default: undefined },
  },
  setup(props) {
    return () =>
      h(AccordionRoot, { type: props.type as 'single' | 'multiple', class: props.className, onValueChange: props.onValueChange }, {
        default: () => [
          h(AccordionItem, { value: 'a' }, {
            default: () => [
              h(AccordionTrigger, null, { default: () => 'Panel A' }),
              h(AccordionPanel, null, { default: () => 'Content A' }),
            ],
          }),
          h(AccordionItem, { value: 'b' }, {
            default: () => [
              h(AccordionTrigger, null, { default: () => 'Panel B' }),
              h(AccordionPanel, null, { default: () => 'Content B' }),
            ],
          }),
        ],
      })
  },
})

describe('AccordionRoot', () => {
  it('renders a div with fc-accordion class and data-type', () => {
    render(AccordionFixture, { props: { type: 'single' } })
    const root = screen.getByText('Panel A').closest('.fc-accordion')
    expect(root).toBeInTheDocument()
    expect(root).toHaveAttribute('data-type', 'single')
  })

  it('accepts an extra class', () => {
    render(AccordionFixture, { props: { className: 'custom' } })
    const root = screen.getByText('Panel A').closest('.fc-accordion')
    expect(root).toHaveClass('custom')
  })
})

describe('AccordionItem', () => {
  it('renders a details element with fc-accordion__item class', () => {
    render(AccordionFixture)
    const details = getDetails('Panel A')
    expect(details).toBeInTheDocument()
    expect(details).toHaveClass('fc-accordion__item')
  })

  it('has data-state=closed initially', () => {
    render(AccordionFixture)
    expect(getDetails('Panel A')).toHaveAttribute('data-state', 'closed')
  })

  it('updates data-state to open after toggle', async () => {
    render(AccordionFixture)
    const details = getDetails('Panel A')
    toggle(details, true)
    await nextTick()
    expect(details).toHaveAttribute('data-state', 'open')
  })

  it('updates data-state back to closed after closing', async () => {
    render(AccordionFixture)
    const details = getDetails('Panel A')
    toggle(details, true)
    await nextTick()
    toggle(details, false)
    await nextTick()
    expect(details).toHaveAttribute('data-state', 'closed')
  })
})

describe('AccordionRoot type=single', () => {
  it('closes other items when one opens', async () => {
    render(AccordionFixture, { props: { type: 'single' } })
    const detailsA = getDetails('Panel A')
    const detailsB = getDetails('Panel B')

    toggle(detailsA, true)
    await nextTick()
    expect(detailsA).toHaveAttribute('data-state', 'open')

    toggle(detailsB, true)
    await nextTick()
    expect(detailsB).toHaveAttribute('data-state', 'open')
    expect(detailsA).toHaveAttribute('data-state', 'closed')
  })
})

describe('AccordionRoot type=multiple', () => {
  it('allows multiple items open simultaneously', async () => {
    render(AccordionFixture, { props: { type: 'multiple' } })
    const detailsA = getDetails('Panel A')
    const detailsB = getDetails('Panel B')

    toggle(detailsA, true)
    await nextTick()
    toggle(detailsB, true)
    await nextTick()

    expect(detailsA).toHaveAttribute('data-state', 'open')
    expect(detailsB).toHaveAttribute('data-state', 'open')
  })
})

describe('AccordionRoot onValueChange', () => {
  it('calls onValueChange with the opened value', async () => {
    const onValueChange = vi.fn()
    render(AccordionFixture, { props: { onValueChange } })
    toggle(getDetails('Panel A'), true)
    await nextTick()
    expect(onValueChange).toHaveBeenCalledWith('a')
  })

  it('calls latest onValueChange if callback identity changes between renders', async () => {
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    const { rerender } = render(AccordionFixture, { props: { onValueChange: fn1 } })
    await rerender({ onValueChange: fn2 })
    toggle(screen.getByText('Panel A').closest('details') as HTMLDetailsElement, true)
    await nextTick()
    expect(fn2).toHaveBeenCalledOnce()
    expect(fn1).not.toHaveBeenCalled()
  })
})

describe('AccordionItem outside AccordionRoot', () => {
  it('throws a descriptive error', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() =>
      render(
        defineComponent({
          setup() {
            return () =>
              h(AccordionItem, { value: 'x' }, {
                default: () => h(AccordionTrigger, null, { default: () => 'X' }),
              })
          },
        }),
      ),
    ).toThrow('AccordionItem must be used inside AccordionRoot')
    consoleError.mockRestore()
    consoleWarn.mockRestore()
  })
})

describe('AccordionTrigger', () => {
  it('renders a summary with fc-accordion__trigger', () => {
    render(AccordionFixture)
    const trigger = screen.getByText('Panel A')
    expect(trigger.tagName).toBe('SUMMARY')
    expect(trigger).toHaveClass('fc-accordion__trigger')
  })

  it('forwards extra props to summary', () => {
    const Example = defineComponent({
      setup() {
        return () =>
          h(AccordionRoot, null, {
            default: () =>
              h(AccordionItem, { value: 'x' }, {
                default: () => [
                  h(AccordionTrigger, { 'data-testid': 'trig' }, { default: () => 'X' }),
                  h(AccordionPanel, null, { default: () => '-' }),
                ],
              }),
          })
      },
    })
    render(Example)
    expect(screen.getByTestId('trig').tagName).toBe('SUMMARY')
  })
})

describe('AccordionPanel', () => {
  it('renders a div with fc-accordion__panel', () => {
    render(AccordionFixture)
    expect(screen.getByText('Content A')).toHaveClass('fc-accordion__panel')
  })
})
