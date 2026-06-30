export const isArrowUp = (e: KeyboardEvent): boolean => e.key === 'ArrowUp'
export const isArrowDown = (e: KeyboardEvent): boolean => e.key === 'ArrowDown'
export const isArrowLeft = (e: KeyboardEvent): boolean => e.key === 'ArrowLeft'
export const isArrowRight = (e: KeyboardEvent): boolean => e.key === 'ArrowRight'
export const isEnter = (e: KeyboardEvent): boolean => e.key === 'Enter'
export const isEscape = (e: KeyboardEvent): boolean => e.key === 'Escape'
export const isSpace = (e: KeyboardEvent): boolean => e.key === ' '
export const isTab = (e: KeyboardEvent): boolean => e.key === 'Tab' && !e.shiftKey
export const isShiftTab = (e: KeyboardEvent): boolean => e.key === 'Tab' && e.shiftKey
export const isHome = (e: KeyboardEvent): boolean => e.key === 'Home'
export const isEnd = (e: KeyboardEvent): boolean => e.key === 'End'
export const isPageUp = (e: KeyboardEvent): boolean => e.key === 'PageUp'
export const isPageDown = (e: KeyboardEvent): boolean => e.key === 'PageDown'

export function getNextIndex(current: number, total: number, loop = true): number {
  if (total === 0) return 0
  if (current >= total - 1) return loop ? 0 : total - 1
  return current + 1
}

export function getPrevIndex(current: number, total: number, loop = true): number {
  if (total === 0) return 0
  if (current <= 0) return loop ? total - 1 : 0
  return current - 1
}

export function getIndexByTypeahead(items: string[], char: string, currentIndex: number): number {
  const lower = char.toLowerCase()
  const total = items.length
  for (let i = 1; i <= total; i++) {
    const idx = (currentIndex + i) % total
    if (items[idx]?.toLowerCase().startsWith(lower)) return idx
  }
  return currentIndex
}
