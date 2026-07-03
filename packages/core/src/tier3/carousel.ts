import { createStore } from '@web-loom/store-core'
import { dispatch } from '../utils/events'

export interface CarouselOptions {
  slideCount: number
  initialIndex?: number
  index?: number
  loop?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
  label?: string
  onSlideChange?: (index: number, prevIndex: number) => void
}

export interface CarouselState {
  currentIndex: number
  isPlaying: boolean
  slideCount: number
}

interface CarouselStoreState {
  currentIndex: number
  isPlaying: boolean
  isManual: boolean
}

export interface Carousel {
  readonly state: CarouselState
  setRootEl(el: HTMLElement | null): void
  setSlideEl(index: number, el: HTMLElement | null): void
  goTo(index: number, options?: { manual?: boolean }): void
  next(options?: { manual?: boolean }): void
  prev(options?: { manual?: boolean }): void
  play(): void
  pause(): void
  getRootProps(): {
    role: 'region'
    'aria-roledescription': 'carousel'
    'aria-label': string
    'aria-live': 'off' | 'polite'
    'data-state': 'playing' | 'paused'
    'data-loop': 'true' | 'false'
    'data-autoplay': 'true' | 'false'
    onMouseEnter(): void
    onMouseLeave(): void
    onFocusIn(): void
    onFocusOut(): void
  }
  getViewportProps(): Record<string, never>
  getTrackProps(): Record<string, never>
  getSlideProps(index: number): {
    role: 'group'
    'aria-roledescription': 'slide'
    'aria-label': string
    'data-state': 'active' | undefined
  }
  getPrevProps(): {
    type: 'button'
    'aria-label': string
    'aria-disabled': true | undefined
    disabled: boolean
    onClick(): void
    onKeyDown(e: KeyboardEvent): void
  }
  getNextProps(): {
    type: 'button'
    'aria-label': string
    'aria-disabled': true | undefined
    disabled: boolean
    onClick(): void
    onKeyDown(e: KeyboardEvent): void
  }
  getIndicatorsProps(): {
    role: 'tablist'
    'aria-label': string
    onKeyDown(e: KeyboardEvent): void
  }
  getIndicatorProps(index: number): {
    type: 'button'
    role: 'tab'
    'aria-label': string
    'aria-selected': boolean
    'aria-current': true | undefined
    tabIndex: 0 | -1
    'data-state': 'active' | undefined
    onClick(): void
  }
  subscribe(listener: (s: CarouselStoreState, prev: CarouselStoreState) => void): () => void
  destroy(): void
}

function slideCount(opts: CarouselOptions): number {
  return Math.max(Math.round(opts.slideCount), 0)
}

function clampIndex(index: number, count: number): number {
  if (count <= 0) return 0
  return Math.min(Math.max(Math.round(index), 0), count - 1)
}

function wrapIndex(index: number, count: number): number {
  if (count <= 0) return 0
  return ((index % count) + count) % count
}

export function createCarousel(opts: CarouselOptions): Carousel {
  const loop = opts.loop ?? false
  const autoPlay = opts.autoPlay ?? false
  const autoPlayInterval = Math.max(opts.autoPlayInterval ?? 4000, 16)
  const isControlled = opts.index !== undefined

  const store = createStore(
    {
      currentIndex: clampIndex(opts.index ?? opts.initialIndex ?? 0, slideCount(opts)),
      isPlaying: autoPlay,
      isManual: !autoPlay,
    } as CarouselStoreState,
    (set) => ({
      setCurrentIndex(index: number) {
        if (!isControlled) set((s) => ({ ...s, currentIndex: clampIndex(index, slideCount(opts)) }))
      },
      setPlaying(isPlaying: boolean) {
        set((s) => ({ ...s, isPlaying }))
      },
      setManual(isManual: boolean) {
        set((s) => ({ ...s, isManual }))
      },
    })
  )

  let rootEl: HTMLElement | null = null
  const slideEls = new Map<number, HTMLElement>()
  let autoPlayTimer: ReturnType<typeof setInterval> | null = null

  function count(): number {
    return slideCount(opts)
  }

  function currentIndex(): number {
    return clampIndex(isControlled ? (opts.index ?? 0) : store.getState().currentIndex, count())
  }

  function isPlaying(): boolean {
    return store.getState().isPlaying
  }

  function isManual(): boolean {
    return store.getState().isManual
  }

  function hasPrev(): boolean {
    return loop || currentIndex() > 0
  }

  function hasNext(): boolean {
    return loop || currentIndex() < count() - 1
  }

  function scrollTo(index: number): void {
    const slideEl = slideEls.get(index)
    if (typeof slideEl?.scrollIntoView !== 'function') return
    slideEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }

  function stopTimer(): void {
    if (autoPlayTimer) clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }

  function startTimer(): void {
    stopTimer()
    if (!autoPlay || !isPlaying() || count() <= 1) return
    autoPlayTimer = setInterval(() => instance.next({ manual: false }), autoPlayInterval)
  }

  function nextIndex(index: number): number {
    if (loop) return wrapIndex(index + 1, count())
    return clampIndex(index + 1, count())
  }

  function prevIndex(index: number): number {
    if (loop) return wrapIndex(index - 1, count())
    return clampIndex(index - 1, count())
  }

  function changeTo(index: number, manual: boolean): void {
    const total = count()
    if (total === 0) return
    const prev = currentIndex()
    const next = loop ? wrapIndex(index, total) : clampIndex(index, total)
    if (next === prev) return
    store.actions.setCurrentIndex(next)
    store.actions.setManual(manual)
    scrollTo(next)
    dispatch(rootEl, 'slide-change', { index: next, prevIndex: prev })
    opts.onSlideChange?.(next, prev)
  }

  const instance: Carousel = {
    get state() {
      return {
        currentIndex: currentIndex(),
        isPlaying: isPlaying(),
        slideCount: count(),
      }
    },

    setRootEl(el) {
      rootEl = el
      startTimer()
    },

    setSlideEl(index, el) {
      if (el) slideEls.set(index, el)
      else slideEls.delete(index)
    },

    goTo(index, options = {}) {
      changeTo(index, options.manual ?? true)
      startTimer()
    },

    next(options = {}) {
      if (!hasNext()) return
      changeTo(nextIndex(currentIndex()), options.manual ?? true)
      startTimer()
    },

    prev(options = {}) {
      if (!hasPrev()) return
      changeTo(prevIndex(currentIndex()), options.manual ?? true)
      startTimer()
    },

    play() {
      if (!autoPlay) return
      store.actions.setPlaying(true)
      startTimer()
    },

    pause() {
      store.actions.setPlaying(false)
      stopTimer()
    },

    getRootProps() {
      return {
        role: 'region',
        'aria-roledescription': 'carousel',
        'aria-label': opts.label ?? 'Carousel',
        'aria-live': isPlaying() && !isManual() ? 'off' : 'polite',
        'data-state': isPlaying() ? 'playing' : 'paused',
        'data-loop': loop ? 'true' : 'false',
        'data-autoplay': autoPlay ? 'true' : 'false',
        onMouseEnter() {
          instance.pause()
        },
        onMouseLeave() {
          instance.play()
        },
        onFocusIn() {
          instance.pause()
        },
        onFocusOut() {
          instance.play()
        },
      }
    },

    getViewportProps() {
      return {}
    },

    getTrackProps() {
      return {}
    },

    getSlideProps(index) {
      const active = currentIndex() === index
      return {
        role: 'group',
        'aria-roledescription': 'slide',
        'aria-label': `${index + 1} of ${count()}`,
        'data-state': active ? 'active' : undefined,
      }
    },

    getPrevProps() {
      const disabled = !hasPrev()
      return {
        type: 'button',
        'aria-label': 'Previous slide',
        'aria-disabled': disabled ? true : undefined,
        disabled,
        onClick() {
          instance.prev()
        },
        onKeyDown(e) {
          if (e.key === 'ArrowLeft') {
            e.preventDefault()
            instance.prev()
          } else if (e.key === 'ArrowRight') {
            e.preventDefault()
            instance.next()
          }
        },
      }
    },

    getNextProps() {
      const disabled = !hasNext()
      return {
        type: 'button',
        'aria-label': 'Next slide',
        'aria-disabled': disabled ? true : undefined,
        disabled,
        onClick() {
          instance.next()
        },
        onKeyDown(e) {
          if (e.key === 'ArrowLeft') {
            e.preventDefault()
            instance.prev()
          } else if (e.key === 'ArrowRight') {
            e.preventDefault()
            instance.next()
          }
        },
      }
    },

    getIndicatorsProps() {
      return {
        role: 'tablist',
        'aria-label': 'Slides',
        onKeyDown(e) {
          if (e.key === 'ArrowLeft') {
            e.preventDefault()
            instance.prev()
          } else if (e.key === 'ArrowRight') {
            e.preventDefault()
            instance.next()
          }
        },
      }
    },

    getIndicatorProps(index) {
      const active = currentIndex() === index
      return {
        type: 'button',
        role: 'tab',
        'aria-label': `Slide ${index + 1}`,
        'aria-selected': active,
        'aria-current': active ? true : undefined,
        tabIndex: active ? 0 : -1,
        'data-state': active ? 'active' : undefined,
        onClick() {
          instance.goTo(index)
        },
      }
    },

    subscribe: store.subscribe.bind(store),

    destroy() {
      stopTimer()
      slideEls.clear()
      store.destroy()
    },
  }

  startTimer()
  return instance
}
