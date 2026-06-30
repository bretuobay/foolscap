import {
  getNextIndex,
  getPrevIndex,
  isArrowDown,
  isArrowLeft,
  isArrowRight,
  isArrowUp,
  isEnd,
  isHome,
} from './keyboard'

export interface RovingTabindex {
  setActive(index: number): void
  handleKeydown(event: KeyboardEvent): void
  destroy(): void
}

export function createRovingTabindex(
  getItems: () => HTMLElement[],
  options?: {
    loop?: boolean
    orientation?: 'horizontal' | 'vertical' | 'both'
    onActivate?: (index: number) => void
  }
): RovingTabindex {
  const loop = options?.loop ?? true
  const orientation = options?.orientation ?? 'both'
  let activeIndex = 0

  function setActive(index: number): void {
    const items = getItems()
    if (items.length === 0) return
    const clamped = Math.max(0, Math.min(index, items.length - 1))
    items.forEach((item, i) => {
      item.tabIndex = i === clamped ? 0 : -1
    })
    items[clamped].focus()
    options?.onActivate?.(clamped)
    activeIndex = clamped
  }

  function handleKeydown(e: KeyboardEvent): void {
    const items = getItems()
    const total = items.length
    if (total === 0) return

    const goNext =
      ((orientation === 'horizontal' || orientation === 'both') && isArrowRight(e)) ||
      ((orientation === 'vertical' || orientation === 'both') && isArrowDown(e))
    const goPrev =
      ((orientation === 'horizontal' || orientation === 'both') && isArrowLeft(e)) ||
      ((orientation === 'vertical' || orientation === 'both') && isArrowUp(e))

    if (goNext) {
      e.preventDefault()
      setActive(getNextIndex(activeIndex, total, loop))
    } else if (goPrev) {
      e.preventDefault()
      setActive(getPrevIndex(activeIndex, total, loop))
    } else if (isHome(e)) {
      e.preventDefault()
      setActive(0)
    } else if (isEnd(e)) {
      e.preventDefault()
      setActive(total - 1)
    }
  }

  function destroy(): void {
    const items = getItems()
    items.forEach((item) => {
      item.tabIndex = 0
    })
  }

  return { setActive, handleKeydown, destroy }
}
