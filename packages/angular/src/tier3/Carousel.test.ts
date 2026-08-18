import { render, screen } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  CarouselControls,
  CarouselIndicator,
  CarouselIndicators,
  CarouselNext,
  CarouselPrev,
  CarouselRoot,
  CarouselViewport,
} from './Carousel'

const slides = ['First slide', 'Second slide', 'Third slide']
const imports = [
  CarouselRoot,
  CarouselViewport,
  CarouselControls,
  CarouselPrev,
  CarouselNext,
  CarouselIndicators,
  CarouselIndicator,
]

describe('Carousel', () => {
  it('renders carousel semantics and active slide', async () => {
    await render(`<section fc-carousel [slides]="slides" label="Featured articles"></section>`, {
      imports,
      componentProperties: { slides },
    })
    expect(screen.getByRole('region', { name: 'Featured articles' })).toHaveClass('fc-carousel')
    expect(screen.getByRole('group', { name: '1 of 3' })).toHaveAttribute('data-state', 'active')
    expect(screen.getByRole('tab', { name: 'Slide 1' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled()
  })

  it('moves to the next and previous slide', async () => {
    const user = userEvent.setup()
    const onSlideChange = vi.fn()
    await render(
      `<section fc-carousel [slides]="slides" label="Featured articles" (slideChange)="onSlideChange($event)"></section>`,
      { imports, componentProperties: { slides, onSlideChange } },
    )
    await user.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(screen.getByRole('group', { name: '2 of 3' })).toHaveAttribute('data-state', 'active')
    await user.click(screen.getByRole('button', { name: 'Previous slide' }))
    expect(screen.getByRole('group', { name: '1 of 3' })).toHaveAttribute('data-state', 'active')
    expect(onSlideChange).toHaveBeenNthCalledWith(1, 1)
  })

  it('jumps with indicators', async () => {
    const user = userEvent.setup()
    await render(`<section fc-carousel [slides]="slides" label="Featured articles"></section>`, {
      imports,
      componentProperties: { slides },
    })
    await user.click(screen.getByRole('tab', { name: 'Slide 3' }))
    expect(screen.getByRole('group', { name: '3 of 3' })).toHaveAttribute('data-state', 'active')
    expect(screen.getByRole('tab', { name: 'Slide 3' })).toHaveAttribute('aria-current', 'true')
  })

  it('supports loop navigation', async () => {
    const user = userEvent.setup()
    await render(
      `<section fc-carousel [slides]="slides" label="Featured articles" [loop]="true"></section>`,
      { imports, componentProperties: { slides } },
    )
    await user.click(screen.getByRole('button', { name: 'Previous slide' }))
    expect(screen.getByRole('group', { name: '3 of 3' })).toHaveAttribute('data-state', 'active')
  })

  it('reflects controlled index', async () => {
    const user = userEvent.setup()
    const onSlideChange = vi.fn()
    await render(
      `<section fc-carousel [slides]="slides" label="Featured articles" [index]="1" (slideChange)="onSlideChange($event)"></section>`,
      { imports, componentProperties: { slides, onSlideChange } },
    )
    await user.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(screen.getByRole('group', { name: '2 of 3' })).toHaveAttribute('data-state', 'active')
    expect(onSlideChange).toHaveBeenCalledWith(2)
  })
})
