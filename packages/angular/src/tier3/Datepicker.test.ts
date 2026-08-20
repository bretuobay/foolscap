import { render, screen } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DatepickerDialog, DatepickerRoot, DatepickerTrigger } from './Datepicker'

const imports = [DatepickerRoot, DatepickerTrigger, DatepickerDialog]

const template = `
  <fc-datepicker [defaultValue]="defaultValue" locale="en-US" (valueChange)="onValueChange($event)">
    <button fc-datepicker-trigger></button>
    <div fc-datepicker-dialog></div>
  </fc-datepicker>
`

describe('Datepicker', () => {
  it('renders closed by default', async () => {
    await render(template, {
      imports,
      componentProperties: { defaultValue: new Date(2026, 5, 2), onValueChange: () => undefined },
    })
    expect(document.querySelector('.fc-datepicker')).toHaveAttribute('data-state', 'closed')
    expect(screen.getByRole('button', { name: 'Jun 2, 2026' })).toHaveAttribute('aria-haspopup', 'dialog')
    expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('hidden')
  })

  it('opens on trigger click', async () => {
    const user = userEvent.setup()
    await render(template, {
      imports,
      componentProperties: { defaultValue: new Date(2026, 5, 2), onValueChange: () => undefined },
    })
    await user.click(screen.getByRole('button', { name: 'Jun 2, 2026' }))
    expect(document.querySelector('.fc-datepicker')).toHaveAttribute('data-state', 'open')
    expect(screen.getByRole('grid', { name: 'June 2026' })).toBeInTheDocument()
  })

  it('selects a date and closes', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    await render(template, {
      imports,
      componentProperties: { defaultValue: new Date(2026, 5, 2), onValueChange },
    })
    await user.click(screen.getByRole('button', { name: 'Jun 2, 2026' }))
    await user.click(screen.getByRole('button', { name: 'Friday, June 12, 2026' }))
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 5, 12))
    expect(document.querySelector('.fc-datepicker')).toHaveAttribute('data-state', 'closed')
  })

  it('navigates months', async () => {
    const user = userEvent.setup()
    await render(template, {
      imports,
      componentProperties: { defaultValue: new Date(2026, 5, 2), onValueChange: () => undefined },
    })
    await user.click(screen.getByRole('button', { name: 'Jun 2, 2026' }))
    await user.click(screen.getByRole('button', { name: 'Next month' }))
    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeInTheDocument()
  })

  it('supports keyboard date movement', async () => {
    const user = userEvent.setup()
    await render(template, {
      imports,
      componentProperties: { defaultValue: new Date(2026, 5, 2), onValueChange: () => undefined },
    })
    await user.click(screen.getByRole('button', { name: 'Jun 2, 2026' }))
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', { name: 'Wednesday, June 3, 2026' })).toHaveFocus()
  })
})
