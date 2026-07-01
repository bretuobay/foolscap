import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DatepickerDialog, DatepickerRoot, DatepickerTrigger } from './Datepicker'

function renderDatepicker(onValueChange = vi.fn()) {
  return {
    onValueChange,
    ...render(
      <DatepickerRoot
        defaultValue={new Date(2026, 5, 2)}
        onValueChange={onValueChange}
        locale="en-US"
      >
        <DatepickerTrigger />
        <DatepickerDialog />
      </DatepickerRoot>
    ),
  }
}

describe('Datepicker', () => {
  it('renders closed by default', () => {
    renderDatepicker()
    expect(document.querySelector('.fc-datepicker')).toHaveAttribute('data-state', 'closed')
    expect(screen.getByRole('button', { name: 'Jun 2, 2026' })).toHaveAttribute(
      'aria-haspopup',
      'dialog'
    )
    expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('hidden')
  })

  it('opens on trigger click', async () => {
    const user = userEvent.setup()
    renderDatepicker()
    await user.click(screen.getByRole('button', { name: 'Jun 2, 2026' }))
    expect(document.querySelector('.fc-datepicker')).toHaveAttribute('data-state', 'open')
    expect(screen.getByRole('grid', { name: 'June 2026' })).toBeInTheDocument()
  })

  it('selects a date and closes', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderDatepicker(onValueChange)
    await user.click(screen.getByRole('button', { name: 'Jun 2, 2026' }))
    await user.click(screen.getByRole('button', { name: 'Friday, June 12, 2026' }))
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 5, 12))
    expect(document.querySelector('.fc-datepicker')).toHaveAttribute('data-state', 'closed')
  })

  it('navigates months', async () => {
    const user = userEvent.setup()
    renderDatepicker()
    await user.click(screen.getByRole('button', { name: 'Jun 2, 2026' }))
    await user.click(screen.getByRole('button', { name: 'Next month' }))
    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeInTheDocument()
  })

  it('supports keyboard date movement', async () => {
    const user = userEvent.setup()
    renderDatepicker()
    await user.click(screen.getByRole('button', { name: 'Jun 2, 2026' }))
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', { name: 'Wednesday, June 3, 2026' })).toHaveFocus()
  })
})
