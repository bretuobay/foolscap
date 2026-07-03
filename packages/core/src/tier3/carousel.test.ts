import { afterEach, describe, expect, it, vi } from 'vitest'
import { createCarousel } from './carousel'
import { fixture } from '../utils/test-helpers'

describe('createCarousel', () => {
  let cleanup: () => void

  afterEach(() => {
    cleanup?.()
    vi.useRealTimers()
  })

  function setup(opts = {}) {
    const { container, cleanup: c } = fixture(`<section id="carousel"></section>`)
    cleanup = c
    const rootEl = container.querySelector<HTMLElement>('#carousel')!
    const carousel = createCarousel({ slideCount: 3, ...opts })
    carousel.setRootEl(rootEl)
    return { carousel, rootEl }
  }

  it('exposes carousel aria props and active slide state', () => {
    const { carousel } = setup({ initialIndex: 1, label: 'Featured articles' })
    expect(carousel.state).toMatchObject({ currentIndex: 1, isPlaying: false, slideCount: 3 })
    expect(carousel.getRootProps()).toMatchObject({
      role: 'region',
      'aria-roledescription': 'carousel',
      'aria-label': 'Featured articles',
      'aria-live': 'polite',
      'data-state': 'paused',
    })
    expect(carousel.getSlideProps(1)).toMatchObject({
      role: 'group',
      'aria-roledescription': 'slide',
      'aria-label': '2 of 3',
      'data-state': 'active',
    })
    carousel.destroy()
  })

  it('moves next and previous and emits slide-change', () => {
    const onSlideChange = vi.fn()
    const { carousel, rootEl } = setup({ onSlideChange })
    const details: unknown[] = []
    rootEl.addEventListener('fc:slide-change', (event) => details.push((event as CustomEvent).detail))
    carousel.next()
    carousel.prev()
    expect(carousel.state.currentIndex).toBe(0)
    expect(onSlideChange).toHaveBeenNthCalledWith(1, 1, 0)
    expect(onSlideChange).toHaveBeenNthCalledWith(2, 0, 1)
    expect(details).toEqual([
      { index: 1, prevIndex: 0 },
      { index: 0, prevIndex: 1 },
    ])
    carousel.destroy()
  })

  it('disables controls at non-looping boundaries', () => {
    const { carousel } = setup()
    expect(carousel.getPrevProps().disabled).toBe(true)
    carousel.goTo(2)
    expect(carousel.getNextProps().disabled).toBe(true)
    carousel.destroy()
  })

  it('wraps in loop mode', () => {
    const { carousel } = setup({ loop: true })
    carousel.prev()
    expect(carousel.state.currentIndex).toBe(2)
    carousel.next()
    expect(carousel.state.currentIndex).toBe(0)
    carousel.destroy()
  })

  it('supports indicator props and arrow navigation', () => {
    const { carousel } = setup()
    carousel.getIndicatorProps(2).onClick()
    expect(carousel.state.currentIndex).toBe(2)
    expect(carousel.getIndicatorProps(2)['aria-current']).toBe(true)
    carousel.getIndicatorsProps().onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    expect(carousel.state.currentIndex).toBe(1)
    carousel.destroy()
  })

  it('autoplays and pauses on interaction', () => {
    vi.useFakeTimers()
    const { carousel } = setup({ autoPlay: true, autoPlayInterval: 100 })
    expect(carousel.state.isPlaying).toBe(true)
    vi.advanceTimersByTime(100)
    expect(carousel.state.currentIndex).toBe(1)
    carousel.getRootProps().onMouseEnter()
    vi.advanceTimersByTime(100)
    expect(carousel.state.currentIndex).toBe(1)
    carousel.getRootProps().onMouseLeave()
    vi.advanceTimersByTime(100)
    expect(carousel.state.currentIndex).toBe(2)
    carousel.destroy()
  })

  it('reflects controlled index', () => {
    const { carousel } = setup({ index: 1 })
    carousel.next()
    expect(carousel.state.currentIndex).toBe(1)
    carousel.destroy()
  })
})
