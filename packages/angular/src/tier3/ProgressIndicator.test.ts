import { render, screen } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  ProgressIndicatorRoot,
  ProgressIndicatorStepDescription,
  ProgressIndicatorStepIndicator,
  ProgressIndicatorStepLabel,
  ProgressIndicatorStepSrStatus,
  ProgressIndicatorStepView,
} from './ProgressIndicator'

const steps = [
  { label: 'Cart' },
  { label: 'Shipping', description: 'Enter your address' },
  { label: 'Payment' },
]

const imports = [
  ProgressIndicatorRoot,
  ProgressIndicatorStepView,
  ProgressIndicatorStepIndicator,
  ProgressIndicatorStepLabel,
  ProgressIndicatorStepDescription,
  ProgressIndicatorStepSrStatus,
]

describe('ProgressIndicator', () => {
  it('renders semantic steps with current state', async () => {
    await render(
      `<ol fc-progress-indicator [steps]="steps" [defaultStep]="1" label="Checkout steps"></ol>`,
      { imports, componentProperties: { steps } },
    )
    expect(screen.getByRole('list', { name: 'Checkout steps' })).toHaveClass('fc-progress-indicator')
    expect(screen.getByText('Cart').closest('li')).toHaveAttribute('data-state', 'complete')
    expect(screen.getByText('Shipping').closest('li')).toHaveAttribute('aria-current', 'step')
    expect(screen.getByText('Payment').closest('li')).toHaveAttribute('data-state', 'upcoming')
    expect(screen.getByText('Current step')).toHaveClass('fc-progress-indicator__step-sr-status')
  })

  it('blocks future click targets in linear mode', async () => {
    const user = userEvent.setup()
    const onStepChange = vi.fn()
    await render(
      `<ol fc-progress-indicator [steps]="steps" [defaultStep]="1" (stepChange)="onStepChange($event)"></ol>`,
      { imports, componentProperties: { steps, onStepChange } },
    )
    await user.click(screen.getByLabelText('Payment, Upcoming'))
    expect(onStepChange).not.toHaveBeenCalled()
    expect(screen.getByText('Shipping').closest('li')).toHaveAttribute('aria-current', 'step')
  })

  it('navigates to any step in non-linear mode', async () => {
    const user = userEvent.setup()
    const onStepChange = vi.fn()
    await render(
      `<ol fc-progress-indicator [steps]="steps" [linear]="false" (stepChange)="onStepChange($event)"></ol>`,
      { imports, componentProperties: { steps, onStepChange } },
    )
    await user.click(screen.getByRole('button', { name: 'Payment, Upcoming' }))
    expect(screen.getByText('Payment').closest('li')).toHaveAttribute('aria-current', 'step')
    expect(onStepChange).toHaveBeenCalledWith(2)
  })

  it('supports keyboard activation', async () => {
    const user = userEvent.setup()
    await render(`<ol fc-progress-indicator [steps]="steps" [defaultStep]="1"></ol>`, {
      imports,
      componentProperties: { steps },
    })
    const cart = screen.getByRole('button', { name: 'Cart, Completed' })
    cart.focus()
    await user.keyboard('[Enter]')
    expect(screen.getByText('Cart').closest('li')).toHaveAttribute('aria-current', 'step')
  })
})
