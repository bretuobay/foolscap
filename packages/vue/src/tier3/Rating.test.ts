import { h } from 'vue'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RatingRoot } from './Rating'

describe('Rating', () => {
  it('renders interactive radios', () => {
    render(h(RatingRoot, { defaultValue: 3, name: 'rating' }))
    expect(screen.getByRole('radiogroup', { name: 'Rating' })).toHaveClass('fc-rating')
    expect(screen.getByRole('radio', { name: '3 stars' })).toBeChecked()
    expect(screen.getByText('3 out of 5 stars')).toHaveAttribute('aria-live', 'polite')
  })

  it('selects a rating', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(h(RatingRoot, { defaultValue: 3, onValueChange }))
    await user.click(screen.getByRole('radio', { name: '5 stars' }))
    expect(screen.getByRole('radio', { name: '5 stars' })).toBeChecked()
    expect(onValueChange).toHaveBeenCalledWith(5)
  })

  it('renders read-only image mode', () => {
    render(h(RatingRoot, { value: 4, readOnly: true }))
    expect(screen.getByRole('img', { name: 'Rating: 4 out of 5 stars' })).toHaveAttribute(
      'data-state',
      'read-only',
    )
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
  })

  it('supports keyboard arrows', async () => {
    const user = userEvent.setup()
    render(h(RatingRoot, { defaultValue: 2 }))
    screen.getByRole('radio', { name: '2 stars' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: '3 stars' })).toBeChecked()
  })

  it('reflects controlled value', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(h(RatingRoot, { value: 2, onValueChange }))
    await user.click(screen.getByRole('radio', { name: '4 stars' }))
    expect(screen.getByRole('radio', { name: '2 stars' })).toBeChecked()
    expect(onValueChange).toHaveBeenCalledWith(4)
  })
})
