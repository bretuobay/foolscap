import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StepperRoot } from './Stepper'

describe('Stepper', () => {
  it('renders a labelled spinbutton and boundary controls', () => {
    render(<StepperRoot label="Quantity" min={1} max={5} defaultValue={1} />)
    expect(screen.getByRole('group', { name: 'Quantity' })).toHaveClass('fc-stepper')
    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveAttribute('aria-valuenow', '1')
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled()
  })

  it('increments and decrements value', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<StepperRoot label="Quantity" min={1} max={5} defaultValue={1} onValueChange={onValueChange} />)
    await user.click(screen.getByRole('button', { name: 'Increase' }))
    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveAttribute('aria-valuenow', '2')
    await user.click(screen.getByRole('button', { name: 'Decrease' }))
    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveAttribute('aria-valuenow', '1')
    expect(onValueChange).toHaveBeenNthCalledWith(1, 2, 1)
  })

  it('supports keyboard spinbutton shortcuts', async () => {
    const user = userEvent.setup()
    render(<StepperRoot label="Quantity" min={1} max={10} defaultValue={2} largeStep={5} />)
    const input = screen.getByRole('spinbutton', { name: 'Quantity' })
    input.focus()
    await user.keyboard('[PageUp]')
    expect(input).toHaveAttribute('aria-valuenow', '7')
    await user.keyboard('[Home]')
    expect(input).toHaveAttribute('aria-valuenow', '1')
    await user.keyboard('[End]')
    expect(input).toHaveAttribute('aria-valuenow', '10')
  })

  it('renders formatted value text and hidden form input', () => {
    render(
      <StepperRoot
        label="Tickets"
        name="tickets"
        min={1}
        max={5}
        defaultValue={3}
        formatValue={(value) => `${value} tickets`}
      />
    )
    expect(screen.getByRole('spinbutton', { name: 'Tickets' })).toHaveTextContent('3 tickets')
    expect(screen.getByRole('spinbutton', { name: 'Tickets' })).toHaveAttribute('aria-valuetext', '3 tickets')
    expect(document.querySelector('input[name="tickets"]')).toHaveValue('3')
  })

  it('reflects controlled value', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<StepperRoot label="Quantity" min={1} max={5} value={3} onValueChange={onValueChange} />)
    await user.click(screen.getByRole('button', { name: 'Increase' }))
    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveAttribute('aria-valuenow', '3')
    expect(onValueChange).toHaveBeenCalledWith(4, 3)
  })
})
