import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { AccordionRoot, AccordionItem, AccordionTrigger, AccordionPanel } from './Accordion'

// jsdom doesn't dispatch 'toggle' automatically — simulate it manually
function toggle(detailsEl: HTMLDetailsElement, open: boolean) {
  detailsEl.open = open
  detailsEl.dispatchEvent(new Event('toggle'))
}

function getDetails(label: string): HTMLDetailsElement {
  return screen.getByText(label).closest('details') as HTMLDetailsElement
}

function renderAccordion(props: Omit<React.ComponentProps<typeof AccordionRoot>, 'children'> = {}) {
  return render(
    <AccordionRoot {...props}>
      <AccordionItem value="a">
        <AccordionTrigger>Panel A</AccordionTrigger>
        <AccordionPanel>Content A</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Panel B</AccordionTrigger>
        <AccordionPanel>Content B</AccordionPanel>
      </AccordionItem>
    </AccordionRoot>,
  )
}

describe('AccordionRoot', () => {
  it('renders a div with fc-accordion class and data-type', () => {
    renderAccordion({ type: 'single' })
    const root = screen.getByText('Panel A').closest('.fc-accordion')
    expect(root).toBeInTheDocument()
    expect(root).toHaveAttribute('data-type', 'single')
  })

  it('accepts an extra className', () => {
    renderAccordion({ className: 'custom' })
    const root = screen.getByText('Panel A').closest('.fc-accordion')
    expect(root).toHaveClass('custom')
  })
})

describe('AccordionItem', () => {
  it('renders a details element with fc-accordion__item class', () => {
    renderAccordion()
    const details = getDetails('Panel A')
    expect(details).toBeInTheDocument()
    expect(details).toHaveClass('fc-accordion__item')
  })

  it('has data-state=closed initially', () => {
    renderAccordion()
    expect(getDetails('Panel A')).toHaveAttribute('data-state', 'closed')
  })

  it('updates data-state to open after toggle', () => {
    renderAccordion()
    const details = getDetails('Panel A')
    act(() => toggle(details, true))
    expect(details).toHaveAttribute('data-state', 'open')
  })

  it('updates data-state back to closed after closing', () => {
    renderAccordion()
    const details = getDetails('Panel A')
    act(() => toggle(details, true))
    act(() => toggle(details, false))
    expect(details).toHaveAttribute('data-state', 'closed')
  })
})

describe('AccordionRoot type=single', () => {
  it('closes other items when one opens', () => {
    renderAccordion({ type: 'single' })
    const detailsA = getDetails('Panel A')
    const detailsB = getDetails('Panel B')

    act(() => toggle(detailsA, true))
    expect(detailsA).toHaveAttribute('data-state', 'open')

    act(() => toggle(detailsB, true))
    expect(detailsB).toHaveAttribute('data-state', 'open')
    // The machine closes A's DOM element; check data-state after re-render
    expect(detailsA).toHaveAttribute('data-state', 'closed')
  })
})

describe('AccordionRoot type=multiple', () => {
  it('allows multiple items open simultaneously', () => {
    renderAccordion({ type: 'multiple' })
    const detailsA = getDetails('Panel A')
    const detailsB = getDetails('Panel B')

    act(() => toggle(detailsA, true))
    act(() => toggle(detailsB, true))

    expect(detailsA).toHaveAttribute('data-state', 'open')
    expect(detailsB).toHaveAttribute('data-state', 'open')
  })
})

describe('AccordionRoot onValueChange', () => {
  it('calls onValueChange with the opened value', () => {
    const onValueChange = vi.fn()
    renderAccordion({ onValueChange })
    act(() => toggle(getDetails('Panel A'), true))
    expect(onValueChange).toHaveBeenCalledWith('a')
  })

  it('calls latest onValueChange if callback identity changes between renders', () => {
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    const { rerender } = render(
      <AccordionRoot onValueChange={fn1}>
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionPanel>-</AccordionPanel>
        </AccordionItem>
      </AccordionRoot>,
    )
    rerender(
      <AccordionRoot onValueChange={fn2}>
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionPanel>-</AccordionPanel>
        </AccordionItem>
      </AccordionRoot>,
    )
    act(() => toggle(screen.getByText('A').closest('details') as HTMLDetailsElement, true))
    expect(fn2).toHaveBeenCalledOnce()
    expect(fn1).not.toHaveBeenCalled()
  })
})

describe('AccordionItem outside AccordionRoot', () => {
  it('throws a descriptive error', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() =>
      render(
        <AccordionItem value="x">
          <AccordionTrigger>X</AccordionTrigger>
        </AccordionItem>,
      ),
    ).toThrow('AccordionItem must be used inside AccordionRoot')
    consoleError.mockRestore()
  })
})

describe('AccordionTrigger', () => {
  it('renders a summary with fc-accordion__trigger', () => {
    renderAccordion()
    const trigger = screen.getByText('Panel A')
    expect(trigger.tagName).toBe('SUMMARY')
    expect(trigger).toHaveClass('fc-accordion__trigger')
  })

  it('forwards extra props to summary', () => {
    render(
      <AccordionRoot>
        <AccordionItem value="x">
          <AccordionTrigger data-testid="trig">X</AccordionTrigger>
          <AccordionPanel>-</AccordionPanel>
        </AccordionItem>
      </AccordionRoot>,
    )
    expect(screen.getByTestId('trig').tagName).toBe('SUMMARY')
  })
})

describe('AccordionPanel', () => {
  it('renders a div with fc-accordion__panel', () => {
    renderAccordion()
    expect(screen.getByText('Content A')).toHaveClass('fc-accordion__panel')
  })
})
