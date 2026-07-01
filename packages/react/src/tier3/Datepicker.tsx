import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react'
import {
  createDatepicker,
  type Datepicker as DatepickerMachine,
  type DatepickerFirstDayOfWeek,
} from '@web-loom/foolscap-core'
import { useMachine } from '../hooks/useMachine'
import { useCallbackRef } from '../utils/useCallbackRef'
import { cx } from '../utils/cx'

interface DatepickerContextValue {
  machine: DatepickerMachine
  locale: string
  firstDayOfWeek: DatepickerFirstDayOfWeek
  placeholder: string
  injectTriggerEl: (el: HTMLButtonElement | null) => void
  injectDialogEl: (el: HTMLDivElement | null) => void
  injectDayEl: (date: Date, el: HTMLButtonElement | null) => void
}

const DatepickerContext = createContext<DatepickerContextValue | null>(null)

function useDatepickerContext(): DatepickerContextValue {
  const ctx = useContext(DatepickerContext)
  if (!ctx) throw new Error('Datepicker components must be used inside DatepickerRoot')
  return ctx
}

function formatDate(date: Date | null, locale: string, placeholder: string): string {
  if (!date) return placeholder
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function formatMonth(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date)
}

function weekdayLabels(locale: string, firstDayOfWeek: DatepickerFirstDayOfWeek) {
  const sunday = new Date(2026, 5, 7)
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sunday)
    date.setDate(sunday.getDate() + firstDayOfWeek + index)
    return {
      short: new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date),
      long: new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date),
    }
  })
}

export interface DatepickerRootProps {
  value?: Date | null
  defaultValue?: Date
  min?: Date
  max?: Date
  locale?: string
  firstDayOfWeek?: DatepickerFirstDayOfWeek
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  onValueChange?: (date: Date) => void
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  className?: string
  children: React.ReactNode
}

export function DatepickerRoot({
  value,
  defaultValue,
  min,
  max,
  locale = 'en',
  firstDayOfWeek = 0,
  placement,
  onValueChange,
  onOpenChange,
  placeholder = 'Pick a date',
  className,
  children,
}: DatepickerRootProps) {
  const valueRef = useRef(value)
  valueRef.current = value
  const minRef = useRef(min)
  minRef.current = min
  const maxRef = useRef(max)
  maxRef.current = max
  const localeRef = useRef(locale)
  localeRef.current = locale
  const placementRef = useRef(placement)
  placementRef.current = placement
  const defaultValueRef = useRef(defaultValue)
  const stableOnValueChange = useCallbackRef(onValueChange)
  const stableOnOpenChange = useCallbackRef(onOpenChange)

  const machine = useMachine(() =>
    createDatepicker({
      get value() {
        return valueRef.current
      },
      defaultValue: defaultValueRef.current,
      get min() {
        return minRef.current
      },
      get max() {
        return maxRef.current
      },
      get locale() {
        return localeRef.current
      },
      firstDayOfWeek,
      get placement() {
        return placementRef.current
      },
      onValueChange: stableOnValueChange,
      onOpenChange: stableOnOpenChange,
    })
  )

  const injectTriggerEl = useCallback(
    (el: HTMLButtonElement | null) => machine.setTriggerEl(el),
    [machine]
  )
  const injectDialogEl = useCallback(
    (el: HTMLDivElement | null) => machine.setDialogEl(el),
    [machine]
  )
  const injectDayEl = useCallback(
    (date: Date, el: HTMLButtonElement | null) => machine.setDayEl(date, el),
    [machine]
  )

  return (
    <DatepickerContext.Provider
      value={{
        machine,
        locale,
        firstDayOfWeek,
        placeholder,
        injectTriggerEl,
        injectDialogEl,
        injectDayEl,
      }}
    >
      <div className={cx('fc-datepicker', className)} data-state={machine.state.isOpen ? 'open' : 'closed'}>
        {children}
      </div>
    </DatepickerContext.Provider>
  )
}

export interface DatepickerTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>,
    React.RefAttributes<HTMLButtonElement> {
  className?: string
}

export function DatepickerTrigger({ className, ref, children, onClick, onKeyDown, ...props }: DatepickerTriggerProps) {
  const { machine, locale, placeholder, injectTriggerEl } = useDatepickerContext()
  const triggerProps = machine.getTriggerProps()
  const label = children ?? formatDate(machine.state.selectedDate, locale, placeholder)

  return (
    <button
      type="button"
      {...props}
      aria-haspopup={triggerProps['aria-haspopup']}
      aria-expanded={triggerProps['aria-expanded']}
      aria-controls={triggerProps['aria-controls']}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) triggerProps.onClick()
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (!e.defaultPrevented) triggerProps.onKeyDown(e.nativeEvent)
      }}
      ref={(el) => {
        injectTriggerEl(el)
        if (typeof ref === 'function') ref(el)
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el
      }}
      className={cx('fc-datepicker__trigger', className)}
    >
      {label}
    </button>
  )
}

export interface DatepickerDialogProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role'>,
    React.RefAttributes<HTMLDivElement> {
  className?: string
}

export function DatepickerDialog({ className, ref, style, ...props }: DatepickerDialogProps) {
  const { machine, locale, firstDayOfWeek, injectDialogEl, injectDayEl } = useDatepickerContext()
  const state = machine.state
  const dialogProps = machine.getDialogProps()
  const gridProps = machine.getGridProps()
  const labels = useMemo(() => weekdayLabels(locale, firstDayOfWeek), [locale, firstDayOfWeek])
  const month = formatMonth(new Date(state.viewYear, state.viewMonth, 1), locale)
  const { display: _display, ...safeStyle } = (style ?? {}) as React.CSSProperties & {
    display?: string
  }

  return (
    <div
      {...props}
      id={dialogProps.id}
      role={dialogProps.role}
      aria-label={dialogProps['aria-label']}
      aria-modal={dialogProps['aria-modal']}
      hidden={dialogProps.hidden}
      onKeyDown={(e) => dialogProps.onKeyDown(e.nativeEvent)}
      ref={(el) => {
        injectDialogEl(el)
        if (typeof ref === 'function') ref(el)
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el
      }}
      style={safeStyle}
      className={cx('fc-datepicker__dialog', className)}
    >
      <div className="fc-datepicker__header">
        <button className="fc-datepicker__prev-month" {...machine.getPrevMonthProps()}>
          ‹
        </button>
        <span className="fc-datepicker__month-label" {...machine.getMonthLabelProps()}>
          {month}
        </span>
        <button className="fc-datepicker__next-month" {...machine.getNextMonthProps()}>
          ›
        </button>
      </div>

      <table className="fc-datepicker__grid" role={gridProps.role} aria-label={gridProps['aria-label']}>
        <thead className="fc-datepicker__grid-head">
          <tr>
            {labels.map((label) => (
              <th key={label.long} scope="col" abbr={label.long}>
                {label.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="fc-datepicker__grid-body">
          {state.weeks.map((week, row) => (
            <tr key={row}>
              {week.map((date, col) => (
                <td
                  key={`${row}-${col}`}
                  className="fc-datepicker__gridcell"
                  role="gridcell"
                  data-state={date ? undefined : 'outside-month'}
                >
                  {date ? (
                    <DatepickerDay date={date} injectDayEl={injectDayEl} machine={machine} />
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface DatepickerDayProps {
  date: Date
  machine: DatepickerMachine
  injectDayEl: (date: Date, el: HTMLButtonElement | null) => void
}

function DatepickerDay({ date, machine, injectDayEl }: DatepickerDayProps) {
  const dayProps = machine.getDayProps(date)

  return (
    <button
      type={dayProps.type}
      aria-label={dayProps['aria-label']}
      aria-selected={dayProps['aria-selected']}
      aria-current={dayProps['aria-current']}
      disabled={dayProps.disabled}
      tabIndex={dayProps.tabIndex}
      onClick={dayProps.onClick}
      onKeyDown={(e) => dayProps.onKeyDown(e.nativeEvent)}
      ref={(el) => injectDayEl(date, el)}
      className="fc-datepicker__day"
    >
      {date.getDate()}
    </button>
  )
}
