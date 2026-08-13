import { h } from 'vue'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ProgressIndicatorRoot } from './ProgressIndicator'

const steps = [
  { label: 'Cart' },
  { label: 'Shipping', description: 'Enter your address' },
  { label: 'Payment' },
]

describe('ProgressIndicator', () => {
  it('renders semantic steps with current state', () => {
    render(h(ProgressIndicatorRoot, { steps, defaultStep: 1, label: 'Checkout steps' }))
    expect(screen.getByRole('list', { name: 'Checkout steps' })).toHaveClass('fc-progress-indicator')
    expect(screen.getByText('Cart').closest('li')).toHaveAttribute('data-state', 'complete')
    expect(screen.getByText('Shipping').closest('li')).toHaveAttribute('aria-current', 'step')
    expect(screen.getByText('Payment').closest('li')).toHaveAttribute('data-state', 'upcoming')
    expect(screen.getByText('Current step')).toHaveClass('fc-progress-indicator__step-sr-status')
  })

  it('blocks future click targets in linear mode', async () => {
    const user = userEvent.setup()
    const onStepChange = vi.fn()
    render(h(ProgressIndicatorRoot, { steps, defaultStep: 1, onStepChange }))
    await user.click(screen.getByLabelText('Payment, Upcoming'))
    expect(onStepChange).not.toHaveBeenCalled()
    expect(screen.getByText('Shipping').closest('li')).toHaveAttribute('aria-current', 'step')
  })

  it('navigates to any step in non-linear mode', async () => {
    const user = userEvent.setup()
    const onStepChange = vi.fn()
    render(h(ProgressIndicatorRoot, { steps, linear: false, onStepChange }))
    await user.click(screen.getByRole('button', { name: 'Payment, Upcoming' }))
    expect(screen.getByText('Payment').closest('li')).toHaveAttribute('aria-current', 'step')
    expect(onStepChange).toHaveBeenCalledWith(2, 0, 'forward')
  })

  it('supports keyboard activation', async () => {
    const user = userEvent.setup()
    render(h(ProgressIndicatorRoot, { steps, defaultStep: 1 }))
    const cart = screen.getByRole('button', { name: 'Cart, Completed' })
    cart.focus()
    await user.keyboard('[Enter]')
    expect(screen.getByText('Cart').closest('li')).toHaveAttribute('aria-current', 'step')
  })
})
