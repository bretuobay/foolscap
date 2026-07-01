import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
import type { Placement } from '@floating-ui/dom'
import { createStore } from '@web-loom/store-core'
import { dispatch } from '../utils/events'
import { createId } from '../utils/id'

export type DatepickerFirstDayOfWeek = 0 | 1

export interface DatepickerOptions {
  defaultValue?: Date
  value?: Date | null
  min?: Date
  max?: Date
  locale?: string
  firstDayOfWeek?: DatepickerFirstDayOfWeek
  placement?: Placement
  onValueChange?: (date: Date) => void
  onOpenChange?: (open: boolean) => void
}

export interface DatepickerState {
  isOpen: boolean
  selectedDate: Date | null
  focusedDate: Date
  viewMonth: number
  viewYear: number
  weeks: Array<Array<Date | null>>
}

export interface Datepicker {
  readonly state: DatepickerState
  setTriggerEl(el: HTMLElement | null): void
  setDialogEl(el: HTMLElement | null): void
  setDayEl(date: Date, el: HTMLElement | null): void
  open(): void
  close(options?: { restoreFocus?: boolean }): void
  selectDate(date: Date): void
  focusDate(date: Date): void
  goToPreviousMonth(): void
  goToNextMonth(): void
  getTriggerProps(): {
    'aria-haspopup': 'dialog'
    'aria-expanded': boolean
    'aria-controls': string
    onClick(): void
    onKeyDown(e: KeyboardEvent): void
  }
  getDialogProps(): {
    id: string
    role: 'dialog'
    'aria-label': string
    'aria-modal': true
    hidden: boolean
    onKeyDown(e: KeyboardEvent): void
  }
  getHeaderProps(): Record<string, never>
  getPrevMonthProps(): {
    type: 'button'
    'aria-label': string
    onClick(): void
  }
  getNextMonthProps(): {
    type: 'button'
    'aria-label': string
    onClick(): void
  }
  getMonthLabelProps(): {
    'aria-live': 'polite'
  }
  getGridProps(): {
    role: 'grid'
    'aria-label': string
  }
  getDayProps(date: Date): {
    type: 'button'
    'aria-label': string
    'aria-selected': boolean | undefined
    'aria-current': 'date' | undefined
    disabled: boolean
    tabIndex: 0 | -1
    onClick(): void
    onKeyDown(e: KeyboardEvent): void
  }
  subscribe(listener: (s: DatepickerState, prev: DatepickerState) => void): () => void
  destroy(): void
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date: Date, days: number): Date {
  const next = startOfDay(date)
  next.setDate(next.getDate() + days)
  return next
}

function addMonths(date: Date, months: number): Date {
  const next = startOfDay(date)
  const day = next.getDate()
  next.setDate(1)
  next.setMonth(next.getMonth() + months)
  const maxDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()
  next.setDate(Math.min(day, maxDay))
  return next
}

function addYears(date: Date, years: number): Date {
  return addMonths(date, years * 12)
}

function isSameDate(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return Boolean(
    a &&
      b &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
  )
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function isBefore(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime()
}

function isAfter(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() > startOfDay(b).getTime()
}

function isDisabled(date: Date, opts: DatepickerOptions): boolean {
  return Boolean((opts.min && isBefore(date, opts.min)) || (opts.max && isAfter(date, opts.max)))
}

function getWeeks(viewYear: number, viewMonth: number, firstDayOfWeek: DatepickerFirstDayOfWeek) {
  const firstOfMonth = new Date(viewYear, viewMonth, 1)
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const offset = (firstOfMonth.getDay() - firstDayOfWeek + 7) % 7
  const weeks: Array<Array<Date | null>> = []
  let day = 1

  for (let row = 0; row < 6; row++) {
    const week: Array<Date | null> = []
    for (let col = 0; col < 7; col++) {
      const cell = row * 7 + col
      if (cell < offset || day > daysInMonth) {
        week.push(null)
      } else {
        week.push(new Date(viewYear, viewMonth, day))
        day += 1
      }
    }
    weeks.push(week)
  }

  return weeks
}

export function createDatepicker(opts: DatepickerOptions = {}): Datepicker {
  const id = createId('fc-datepicker')
  const dialogId = `${id}-dialog`
  const isControlled = opts.value !== undefined
  const today = startOfDay(new Date())
  const initialSelected = opts.value !== undefined ? opts.value : opts.defaultValue ?? null
  const initialFocused = startOfDay(initialSelected ?? today)
  const locale = opts.locale ?? 'en'
  const firstDayOfWeek = opts.firstDayOfWeek ?? 0

  const store = createStore(
    {
      isOpen: false,
      selectedDate: initialSelected ? startOfDay(initialSelected) : null,
      focusedDate: initialFocused,
      viewMonth: initialFocused.getMonth(),
      viewYear: initialFocused.getFullYear(),
      weeks: getWeeks(initialFocused.getFullYear(), initialFocused.getMonth(), firstDayOfWeek),
    } as DatepickerState,
    (set) => ({
      setOpen(open: boolean) {
        set((s) => ({ ...s, isOpen: open }))
        opts.onOpenChange?.(open)
      },
      setSelectedDate(date: Date) {
        if (!isControlled) set((s) => ({ ...s, selectedDate: startOfDay(date) }))
        opts.onValueChange?.(startOfDay(date))
      },
      setFocusedDate(date: Date) {
        const focusedDate = startOfDay(date)
        set((s) => ({
          ...s,
          focusedDate,
          viewMonth: focusedDate.getMonth(),
          viewYear: focusedDate.getFullYear(),
          weeks: getWeeks(focusedDate.getFullYear(), focusedDate.getMonth(), firstDayOfWeek),
        }))
      },
      setView(year: number, month: number) {
        set((s) => ({
          ...s,
          viewYear: year,
          viewMonth: month,
          weeks: getWeeks(year, month, firstDayOfWeek),
        }))
      },
    })
  )

  let triggerEl: HTMLElement | null = null
  let dialogEl: HTMLElement | null = null
  const dayEls = new Map<string, HTMLElement>()
  let cleanupAutoUpdate: (() => void) | null = null

  function currentSelected(): Date | null {
    return isControlled ? (opts.value ? startOfDay(opts.value) : null) : store.getState().selectedDate
  }

  function monthLabel(): string {
    const { viewYear, viewMonth } = store.getState()
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
      new Date(viewYear, viewMonth, 1)
    )
  }

  function dayLabel(date: Date): string {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  async function positionDialog(hideWhileMeasuring = true): Promise<void> {
    if (!triggerEl || !dialogEl) return
    if (hideWhileMeasuring) dialogEl.style.visibility = 'hidden'

    const { x, y } = await computePosition(triggerEl, dialogEl, {
      placement: opts.placement ?? 'bottom-start',
      strategy: 'fixed',
      middleware: [offset(4), flip(), shift({ padding: 4 })],
    })

    Object.assign(dialogEl.style, {
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      ...(hideWhileMeasuring ? { visibility: '' } : {}),
    })
  }

  function focusFocusedDay(): void {
    const key = toIsoDate(store.getState().focusedDate)
    setTimeout(() => dayEls.get(key)?.focus(), 0)
  }

  function handleDocPointerdown(e: PointerEvent): void {
    if (!store.getState().isOpen) return
    const target = e.target as Node
    if (!dialogEl?.contains(target) && !triggerEl?.contains(target)) {
      instance.close()
    }
  }

  function moveFocus(date: Date): void {
    store.actions.setFocusedDate(date)
    focusFocusedDay()
  }

  function handleDayKey(e: KeyboardEvent): void {
    const focused = store.getState().focusedDate
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        moveFocus(addDays(focused, -1))
        break
      case 'ArrowRight':
        e.preventDefault()
        moveFocus(addDays(focused, 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        moveFocus(addDays(focused, -7))
        break
      case 'ArrowDown':
        e.preventDefault()
        moveFocus(addDays(focused, 7))
        break
      case 'Home':
        e.preventDefault()
        moveFocus(addDays(focused, -((focused.getDay() - firstDayOfWeek + 7) % 7)))
        break
      case 'End':
        e.preventDefault()
        moveFocus(addDays(focused, 6 - ((focused.getDay() - firstDayOfWeek + 7) % 7)))
        break
      case 'PageUp':
        e.preventDefault()
        moveFocus(e.shiftKey ? addYears(focused, -1) : addMonths(focused, -1))
        break
      case 'PageDown':
        e.preventDefault()
        moveFocus(e.shiftKey ? addYears(focused, 1) : addMonths(focused, 1))
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        instance.selectDate(focused)
        break
      case 'Escape':
        e.preventDefault()
        instance.close({ restoreFocus: true })
        break
    }
  }

  const instance: Datepicker = {
    get state() {
      const selectedDate = currentSelected()
      return { ...store.getState(), selectedDate }
    },

    setTriggerEl(el) {
      triggerEl = el
    },

    setDialogEl(el) {
      if (!el && dialogEl) {
        cleanupAutoUpdate?.()
        cleanupAutoUpdate = null
        dialogEl.style.display = ''
      }
      dialogEl = el
      if (el && !store.getState().isOpen) el.style.display = 'none'
    },

    setDayEl(date, el) {
      const key = toIsoDate(date)
      if (el) dayEls.set(key, el)
      else dayEls.delete(key)
    },

    open() {
      if (!triggerEl || !dialogEl) return
      if (store.getState().isOpen) return

      const focused = currentSelected() ?? today
      store.actions.setFocusedDate(focused)
      dialogEl.style.display = ''
      dialogEl.removeAttribute('hidden')
      store.actions.setOpen(true)
      document.addEventListener('pointerdown', handleDocPointerdown)
      void positionDialog(true)
      cleanupAutoUpdate = autoUpdate(triggerEl, dialogEl, () => {
        void positionDialog(false)
      })
      focusFocusedDay()
      dispatch(triggerEl, 'open', {})
    },

    close(options = {}) {
      if (!store.getState().isOpen) return

      cleanupAutoUpdate?.()
      cleanupAutoUpdate = null
      if (dialogEl) {
        dialogEl.style.display = 'none'
        dialogEl.setAttribute('hidden', '')
      }
      store.actions.setOpen(false)
      document.removeEventListener('pointerdown', handleDocPointerdown)
      dispatch(triggerEl, 'close', {})
      if (options.restoreFocus) triggerEl?.focus()
    },

    selectDate(date) {
      if (isDisabled(date, opts)) return
      const selected = startOfDay(date)
      store.actions.setSelectedDate(selected)
      dispatch(triggerEl, 'change', { date: selected, iso: toIsoDate(selected) })
      instance.close({ restoreFocus: true })
    },

    focusDate(date) {
      moveFocus(date)
    },

    goToPreviousMonth() {
      const { viewYear, viewMonth, focusedDate } = store.getState()
      const next = new Date(viewYear, viewMonth - 1, Math.min(focusedDate.getDate(), 28))
      moveFocus(next)
    },

    goToNextMonth() {
      const { viewYear, viewMonth, focusedDate } = store.getState()
      const next = new Date(viewYear, viewMonth + 1, Math.min(focusedDate.getDate(), 28))
      moveFocus(next)
    },

    getTriggerProps() {
      return {
        'aria-haspopup': 'dialog',
        'aria-expanded': store.getState().isOpen,
        'aria-controls': dialogId,
        onClick() {
          if (store.getState().isOpen) instance.close()
          else instance.open()
        },
        onKeyDown(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            instance.open()
          }
        },
      }
    },

    getDialogProps() {
      return {
        id: dialogId,
        role: 'dialog',
        'aria-label': 'Choose date',
        'aria-modal': true,
        hidden: !store.getState().isOpen,
        onKeyDown(e) {
          if (e.key === 'Escape') {
            e.preventDefault()
            instance.close({ restoreFocus: true })
          }
        },
      }
    },

    getHeaderProps() {
      return {}
    },

    getPrevMonthProps() {
      return {
        type: 'button',
        'aria-label': 'Previous month',
        onClick: instance.goToPreviousMonth,
      }
    },

    getNextMonthProps() {
      return {
        type: 'button',
        'aria-label': 'Next month',
        onClick: instance.goToNextMonth,
      }
    },

    getMonthLabelProps() {
      return { 'aria-live': 'polite' }
    },

    getGridProps() {
      return {
        role: 'grid',
        'aria-label': monthLabel(),
      }
    },

    getDayProps(date) {
      const selected = currentSelected()
      const focused = store.getState().focusedDate
      const disabled = isDisabled(date, opts)
      return {
        type: 'button',
        'aria-label': dayLabel(date),
        'aria-selected': isSameDate(selected, date) ? true : undefined,
        'aria-current': isSameDate(today, date) ? 'date' : undefined,
        disabled,
        tabIndex: isSameDate(focused, date) ? 0 : -1,
        onClick() {
          instance.selectDate(date)
        },
        onKeyDown: handleDayKey,
      }
    },

    subscribe: store.subscribe.bind(store),

    destroy() {
      cleanupAutoUpdate?.()
      cleanupAutoUpdate = null
      if (dialogEl) dialogEl.style.display = ''
      document.removeEventListener('pointerdown', handleDocPointerdown)
      store.destroy()
    },
  }

  return instance
}

export const datepickerUtils = {
  toIsoDate,
}
