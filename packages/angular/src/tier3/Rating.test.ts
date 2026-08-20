import { render, screen } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RatingItem, RatingItems, RatingReadOnlyIcon, RatingRoot, RatingValueLabel } from './Rating'

const imports = [RatingRoot, RatingItems, RatingItem, RatingValueLabel, RatingReadOnlyIcon]

describe('Rating', () => {
  it('renders interactive radios', async () => {
    await render(`<fc-rating [defaultValue]="3" name="rating"></fc-rating>`, { imports })
    expect(screen.getByRole('radiogroup', { name: 'Rating' })).toHaveClass('fc-rating')
    expect(screen.getByRole('radio', { name: '3 stars' })).toBeChecked()
    expect(screen.getByText('3 out of 5 stars')).toHaveAttribute('aria-live', 'polite')
  })

  it('selects a rating', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    await render(`<fc-rating [defaultValue]="3" (valueChange)="onValueChange($event)"></fc-rating>`, {
      imports,
      componentProperties: { onValueChange },
    })
    await user.click(screen.getByRole('radio', { name: '5 stars' }))
    expect(screen.getByRole('radio', { name: '5 stars' })).toBeChecked()
    expect(onValueChange).toHaveBeenCalledWith(5)
  })

  it('renders read-only image mode', async () => {
    await render(`<fc-rating [value]="4" [readOnly]="true"></fc-rating>`, { imports })
    expect(screen.getByRole('img', { name: 'Rating: 4 out of 5 stars' })).toHaveAttribute(
      'data-state',
      'read-only',
    )
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
  })

  it('supports keyboard arrows', async () => {
    const user = userEvent.setup()
    await render(`<fc-rating [defaultValue]="2"></fc-rating>`, { imports })
    screen.getByRole('radio', { name: '2 stars' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: '3 stars' })).toBeChecked()
  })

  it('reflects controlled value', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    await render(`<fc-rating [value]="2" (valueChange)="onValueChange($event)"></fc-rating>`, {
      imports,
      componentProperties: { onValueChange },
    })
    await user.click(screen.getByRole('radio', { name: '4 stars' }))
    expect(screen.getByRole('radio', { name: '2 stars' })).toBeChecked()
    expect(onValueChange).toHaveBeenCalledWith(4)
  })
})
