import { render, screen } from '@testing-library/angular'
import { describe, expect, it, vi } from 'vitest'
import { AccordionItem, AccordionPanel, AccordionRoot, AccordionTrigger } from './Accordion'

const accordionImports = [AccordionRoot, AccordionItem, AccordionTrigger, AccordionPanel]

const accordionTemplate = `
  <fc-accordion [type]="type" (valueChange)="onValueChange($event)">
    <details fc-accordion-item value="a">
      <summary fc-accordion-trigger>Panel A</summary>
      <div fc-accordion-panel>Content A</div>
    </details>
    <details fc-accordion-item value="b">
      <summary fc-accordion-trigger>Panel B</summary>
      <div fc-accordion-panel>Content B</div>
    </details>
  </fc-accordion>
`

function toggle(detailsEl: HTMLDetailsElement, open: boolean) {
  detailsEl.open = open
  detailsEl.dispatchEvent(new Event('toggle'))
}

function getDetails(label: string): HTMLDetailsElement {
  return screen.getByText(label).closest('details') as HTMLDetailsElement
}

describe('AccordionRoot', () => {
  it('renders a div with fc-accordion class and data-type', async () => {
    await render(accordionTemplate, {
      imports: accordionImports,
      componentProperties: { type: 'single', onValueChange: () => undefined },
    })
    const root = screen.getByText('Panel A').closest('.fc-accordion')
    expect(root).toBeInTheDocument()
    expect(root).toHaveAttribute('data-type', 'single')
  })

  it('accepts an extra class', async () => {
    await render(
      `
        <fc-accordion class="custom">
          <details fc-accordion-item value="a">
            <summary fc-accordion-trigger>Panel A</summary>
            <div fc-accordion-panel>Content A</div>
          </details>
        </fc-accordion>
      `,
      { imports: accordionImports },
    )
    const root = screen.getByText('Panel A').closest('.fc-accordion')
    expect(root).toHaveClass('custom')
  })
})

describe('AccordionItem', () => {
  it('renders a details element with fc-accordion__item class', async () => {
    await render(accordionTemplate, {
      imports: accordionImports,
      componentProperties: { type: 'single', onValueChange: () => undefined },
    })
    const details = getDetails('Panel A')
    expect(details).toBeInTheDocument()
    expect(details).toHaveClass('fc-accordion__item')
  })

  it('has data-state=closed initially', async () => {
    await render(accordionTemplate, {
      imports: accordionImports,
      componentProperties: { type: 'single', onValueChange: () => undefined },
    })
    expect(getDetails('Panel A')).toHaveAttribute('data-state', 'closed')
  })

  it('updates data-state to open after toggle', async () => {
    const { fixture } = await render(accordionTemplate, {
      imports: accordionImports,
      componentProperties: { type: 'single', onValueChange: () => undefined },
    })
    const details = getDetails('Panel A')
    toggle(details, true)
    fixture.detectChanges()
    expect(details).toHaveAttribute('data-state', 'open')
  })

  it('updates data-state back to closed after closing', async () => {
    const { fixture } = await render(accordionTemplate, {
      imports: accordionImports,
      componentProperties: { type: 'single', onValueChange: () => undefined },
    })
    const details = getDetails('Panel A')
    toggle(details, true)
    fixture.detectChanges()
    toggle(details, false)
    fixture.detectChanges()
    expect(details).toHaveAttribute('data-state', 'closed')
  })
})

describe('AccordionRoot type=single', () => {
  it('closes other items when one opens', async () => {
    const { fixture } = await render(accordionTemplate, {
      imports: accordionImports,
      componentProperties: { type: 'single', onValueChange: () => undefined },
    })
    const detailsA = getDetails('Panel A')
    const detailsB = getDetails('Panel B')

    toggle(detailsA, true)
    fixture.detectChanges()
    expect(detailsA).toHaveAttribute('data-state', 'open')

    toggle(detailsB, true)
    fixture.detectChanges()
    expect(detailsB).toHaveAttribute('data-state', 'open')
    expect(detailsA).toHaveAttribute('data-state', 'closed')
  })
})

describe('AccordionRoot type=multiple', () => {
  it('allows multiple items open simultaneously', async () => {
    const { fixture } = await render(accordionTemplate, {
      imports: accordionImports,
      componentProperties: { type: 'multiple', onValueChange: () => undefined },
    })
    const detailsA = getDetails('Panel A')
    const detailsB = getDetails('Panel B')

    toggle(detailsA, true)
    fixture.detectChanges()
    toggle(detailsB, true)
    fixture.detectChanges()

    expect(detailsA).toHaveAttribute('data-state', 'open')
    expect(detailsB).toHaveAttribute('data-state', 'open')
  })
})

describe('AccordionRoot onValueChange', () => {
  it('calls onValueChange with the opened value', async () => {
    const onValueChange = vi.fn()
    await render(accordionTemplate, {
      imports: accordionImports,
      componentProperties: { type: 'single', onValueChange },
    })
    toggle(getDetails('Panel A'), true)
    expect(onValueChange).toHaveBeenCalledWith('a')
  })

  it('calls latest onValueChange if callback identity changes between renders', async () => {
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    let current = fn1
    await render(accordionTemplate, {
      imports: accordionImports,
      componentProperties: {
        type: 'single',
        onValueChange: (value: string | string[]) => current(value),
      },
    })
    current = fn2
    toggle(screen.getByText('Panel A').closest('details') as HTMLDetailsElement, true)
    expect(fn2).toHaveBeenCalledOnce()
    expect(fn1).not.toHaveBeenCalled()
  })
})

describe('AccordionItem outside AccordionRoot', () => {
  it('throws a descriptive error', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await expect(
      render(
        `<details fc-accordion-item value="x"><summary fc-accordion-trigger>X</summary></details>`,
        { imports: [AccordionItem, AccordionTrigger] },
      ),
    ).rejects.toThrow('AccordionItem must be used inside AccordionRoot')
    consoleError.mockRestore()
    consoleWarn.mockRestore()
  })
})

describe('AccordionTrigger', () => {
  it('renders a summary with fc-accordion__trigger', async () => {
    await render(accordionTemplate, {
      imports: accordionImports,
      componentProperties: { type: 'single', onValueChange: () => undefined },
    })
    const trigger = screen.getByText('Panel A')
    expect(trigger.tagName).toBe('SUMMARY')
    expect(trigger).toHaveClass('fc-accordion__trigger')
  })

  it('forwards extra props to summary', async () => {
    await render(
      `
        <fc-accordion>
          <details fc-accordion-item value="x">
            <summary fc-accordion-trigger data-testid="trig">X</summary>
            <div fc-accordion-panel>-</div>
          </details>
        </fc-accordion>
      `,
      { imports: accordionImports },
    )
    expect(screen.getByTestId('trig').tagName).toBe('SUMMARY')
  })
})

describe('AccordionPanel', () => {
  it('renders a div with fc-accordion__panel', async () => {
    await render(accordionTemplate, {
      imports: accordionImports,
      componentProperties: { type: 'single', onValueChange: () => undefined },
    })
    expect(screen.getByText('Content A')).toHaveClass('fc-accordion__panel')
  })
})
