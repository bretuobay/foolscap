import { h } from 'vue'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CarouselRoot } from './Carousel'

const slides = [
  h('article', { key: 'one' }, 'First slide'),
  h('article', { key: 'two' }, 'Second slide'),
  h('article', { key: 'three' }, 'Third slide'),
]

describe('Carousel', () => {
  it('renders carousel semantics and active slide', () => {
    render(h(CarouselRoot, { slides, label: 'Featured articles' }))
    expect(screen.getByRole('region', { name: 'Featured articles' })).toHaveClass('fc-carousel')
    expect(screen.getByRole('group', { name: '1 of 3' })).toHaveAttribute('data-state', 'active')
    expect(screen.getByRole('tab', { name: 'Slide 1' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled()
  })

  it('moves to the next and previous slide', async () => {
    const user = userEvent.setup()
    const onSlideChange = vi.fn()
    render(h(CarouselRoot, { slides, label: 'Featured articles', onSlideChange }))
    await user.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(screen.getByRole('group', { name: '2 of 3' })).toHaveAttribute('data-state', 'active')
    await user.click(screen.getByRole('button', { name: 'Previous slide' }))
    expect(screen.getByRole('group', { name: '1 of 3' })).toHaveAttribute('data-state', 'active')
    expect(onSlideChange).toHaveBeenNthCalledWith(1, 1, 0)
  })

  it('jumps with indicators', async () => {
    const user = userEvent.setup()
    render(h(CarouselRoot, { slides, label: 'Featured articles' }))
    await user.click(screen.getByRole('tab', { name: 'Slide 3' }))
    expect(screen.getByRole('group', { name: '3 of 3' })).toHaveAttribute('data-state', 'active')
    expect(screen.getByRole('tab', { name: 'Slide 3' })).toHaveAttribute('aria-current', 'true')
  })

  it('supports loop navigation', async () => {
    const user = userEvent.setup()
    render(h(CarouselRoot, { slides, label: 'Featured articles', loop: true }))
    await user.click(screen.getByRole('button', { name: 'Previous slide' }))
    expect(screen.getByRole('group', { name: '3 of 3' })).toHaveAttribute('data-state', 'active')
  })

  it('reflects controlled index', async () => {
    const user = userEvent.setup()
    const onSlideChange = vi.fn()
    render(h(CarouselRoot, { slides, label: 'Featured articles', index: 1, onSlideChange }))
    await user.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(screen.getByRole('group', { name: '2 of 3' })).toHaveAttribute('data-state', 'active')
    expect(onSlideChange).toHaveBeenCalledWith(2, 1)
  })
})
