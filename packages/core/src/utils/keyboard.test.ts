import { describe, it, expect } from 'vitest'
import {
  isArrowUp,
  isArrowDown,
  isArrowLeft,
  isArrowRight,
  isEnter,
  isEscape,
  isSpace,
  isTab,
  isShiftTab,
  isHome,
  isEnd,
  getNextIndex,
  getPrevIndex,
  getIndexByTypeahead,
} from './keyboard'

function ke(key: string, opts?: KeyboardEventInit): KeyboardEvent {
  return new KeyboardEvent('keydown', { key, ...opts })
}

describe('key predicates', () => {
  it('isArrowDown', () => {
    expect(isArrowDown(ke('ArrowDown'))).toBe(true)
    expect(isArrowDown(ke('ArrowUp'))).toBe(false)
  })
  it('isArrowUp', () => {
    expect(isArrowUp(ke('ArrowUp'))).toBe(true)
  })
  it('isArrowLeft', () => {
    expect(isArrowLeft(ke('ArrowLeft'))).toBe(true)
  })
  it('isArrowRight', () => {
    expect(isArrowRight(ke('ArrowRight'))).toBe(true)
  })
  it('isEnter', () => {
    expect(isEnter(ke('Enter'))).toBe(true)
  })
  it('isEscape', () => {
    expect(isEscape(ke('Escape'))).toBe(true)
  })
  it('isSpace', () => {
    expect(isSpace(ke(' '))).toBe(true)
  })
  it('isTab', () => {
    expect(isTab(ke('Tab'))).toBe(true)
    expect(isTab(ke('Tab', { shiftKey: true }))).toBe(false)
  })
  it('isShiftTab', () => {
    expect(isShiftTab(ke('Tab', { shiftKey: true }))).toBe(true)
    expect(isShiftTab(ke('Tab'))).toBe(false)
  })
  it('isHome', () => {
    expect(isHome(ke('Home'))).toBe(true)
  })
  it('isEnd', () => {
    expect(isEnd(ke('End'))).toBe(true)
  })
})

describe('getNextIndex', () => {
  it('increments normally', () => {
    expect(getNextIndex(2, 5)).toBe(3)
  })
  it('wraps when loop=true (default)', () => {
    expect(getNextIndex(4, 5)).toBe(0)
  })
  it('clamps when loop=false', () => {
    expect(getNextIndex(4, 5, false)).toBe(4)
  })
  it('handles single item', () => {
    expect(getNextIndex(0, 1)).toBe(0)
  })
})

describe('getPrevIndex', () => {
  it('decrements normally', () => {
    expect(getPrevIndex(3, 5)).toBe(2)
  })
  it('wraps when loop=true (default)', () => {
    expect(getPrevIndex(0, 5)).toBe(4)
  })
  it('clamps when loop=false', () => {
    expect(getPrevIndex(0, 5, false)).toBe(0)
  })
})

describe('getIndexByTypeahead', () => {
  const items = ['Apple', 'Banana', 'Cherry', 'Apricot']

  it('finds the next match from current position', () => {
    expect(getIndexByTypeahead(items, 'a', 0)).toBe(3) // Apricot is next 'a'
  })

  it('wraps around', () => {
    expect(getIndexByTypeahead(items, 'a', 3)).toBe(0) // wraps to Apple
  })

  it('is case-insensitive', () => {
    expect(getIndexByTypeahead(items, 'B', 0)).toBe(1)
  })

  it('returns currentIndex when no match', () => {
    expect(getIndexByTypeahead(items, 'z', 1)).toBe(1)
  })
})
