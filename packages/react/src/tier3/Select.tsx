import React, { createContext, useCallback, useContext, useRef } from 'react'
import { createSelect, type Select as SelectMachine, type SelectOption } from '@web-loom/foolscap-core'
import { useMachine } from '../hooks/useMachine'
import { useCallbackRef } from '../utils/useCallbackRef'
import { cx } from '../utils/cx'

// ─── Context ──────────────────────────────────────────────────────────────────

interface SelectContextValue {
  machine: SelectMachine
  options: SelectOption[]
  placeholder: string
  injectTriggerEl: (el: HTMLButtonElement | null) => void
  injectListboxEl: (el: HTMLDivElement | null) => void
}

const SelectContext = createContext<SelectContextValue | null>(null)

function useSelectContext(): SelectContextValue {
  const ctx = useContext(SelectContext)
  if (!ctx) throw new Error('SelectTrigger and SelectListbox must be used inside SelectRoot')
  return ctx
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export interface SelectRootProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  disabled?: boolean
  /** Adds a visually-hidden native <select> for form submission. */
  name?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children: React.ReactNode
}

export function SelectRoot({
  options,
  value,
  defaultValue,
  onValueChange,
  onOpenChange,
  placeholder = '',
  placement,
  disabled,
  name,
  size,
  className,
  children,
}: SelectRootProps) {
  // Keep mutable opts in refs so the machine always reads the latest values
  // without needing to be recreated on every render.
  const optionsRef = useRef(options)
  optionsRef.current = options
  const valueRef = useRef(value)
  valueRef.current = value
  const placementRef = useRef(placement)
  placementRef.current = placement
  // defaultValue intentionally not updated — snapshot at creation only
  const defaultValueRef = useRef(defaultValue)

  const stableOnValueChange = useCallbackRef(onValueChange)
  const stableOnOpenChange = useCallbackRef(onOpenChange)

  // Machine is created synchronously (useMachine), so DOM ref injections that
  // fire in the same commit phase will already find machineRef populated.
  const machine = useMachine(() =>
    createSelect({
      // Getters allow the machine to always read fresh values via closure
      // without needing explicit updates or machine recreation.
      get options() {
        return optionsRef.current
      },
      get value() {
        return valueRef.current
      },
      defaultValue: defaultValueRef.current,
      onValueChange: stableOnValueChange,
      onOpenChange: stableOnOpenChange,
      get placement() {
        return placementRef.current
      },
    })
  )

  const injectTriggerEl = useCallback(
    (el: HTMLButtonElement | null) => machine.setTriggerEl(el),
    [machine]
  )
  const injectListboxEl = useCallback(
    (el: HTMLDivElement | null) => machine.setListboxEl(el),
    [machine]
  )

  const state = machine.state

  return (
    <SelectContext.Provider value={{ machine, options, placeholder, injectTriggerEl, injectListboxEl }}>
      <div
        className={cx('fc-select', className)}
        data-state={state.open ? 'open' : 'closed'}
        data-size={size}
        data-disabled={disabled ? '' : undefined}
      >
        {name && (
          <select
            className="fc-select__native"
            name={name}
            aria-hidden="true"
            tabIndex={-1}
            value={state.value}
            onChange={() => {/* value synced by machine */}}
          >
            <option value="" />
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
        {children}
      </div>
    </SelectContext.Provider>
  )
}

// ─── Trigger ───────────────────────────────────────────────────────────────────

export interface SelectTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'role'>,
    React.RefAttributes<HTMLButtonElement> {
  placeholder?: string
  className?: string
}

export function SelectTrigger({
  className,
  ref,
  placeholder: localPlaceholder,
  disabled,
  ...props
}: SelectTriggerProps) {
  const { machine, options, placeholder, injectTriggerEl } = useSelectContext()
  const triggerProps = machine.getTriggerProps()
  const state = machine.state

  const selectedLabel = options.find((o) => o.value === state.value)?.label
  const effectivePlaceholder = localPlaceholder ?? placeholder
  const displayText = selectedLabel ?? effectivePlaceholder
  const isEmpty = !selectedLabel

  // Destructure machine props individually to bridge DOM ↔ React event types.
  const {
    role,
    tabIndex,
    'aria-expanded': ariaExpanded,
    'aria-haspopup': ariaHaspopup,
    'aria-controls': ariaControls,
    'aria-activedescendant': ariaActivedescendant,
    onClick: machineClick,
    onKeyDown: machineKeyDown,
  } = triggerProps

  return (
    <button
      type="button"
      disabled={disabled}
      {...props}
      role={role}
      tabIndex={tabIndex}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
      aria-controls={ariaControls}
      aria-activedescendant={ariaActivedescendant}
      onClick={machineClick}
      onKeyDown={(e) => machineKeyDown(e.nativeEvent)}
      ref={(el) => {
        injectTriggerEl(el)
        if (typeof ref === 'function') ref(el)
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el
      }}
      className={cx('fc-select__trigger', className)}
    >
      <span
        className={cx(
          'fc-select__trigger-value',
          isEmpty && 'fc-select__trigger-value--placeholder'
        )}
      >
        {displayText}
      </span>
      <span className="fc-select__trigger-icon" aria-hidden="true">
        ▾
      </span>
    </button>
  )
}

// ─── Listbox ───────────────────────────────────────────────────────────────────

export interface SelectListboxProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role'>,
    React.RefAttributes<HTMLDivElement> {
  className?: string
}

export function SelectListbox({
  className,
  ref,
  style,
  'aria-label': ariaLabel,
  ...props
}: SelectListboxProps) {
  const { machine, options, injectListboxEl } = useSelectContext()
  const listboxProps = machine.getListboxProps()
  const state = machine.state

  // Strip display from user styles — machine owns style.display via inline assignment
  // (same pattern as PopoverContent; see feedback_machine_visibility memory).
  const { display: _display, ...safeStyle } = (style ?? {}) as React.CSSProperties & {
    display?: string
  }

  // Destructure to bridge DOM ↔ React event types for onKeyDown.
  const {
    id: listboxId,
    role: listboxRole,
    hidden,
    onKeyDown: listboxKeyDown,
  } = listboxProps

  return (
    <div
      {...props}
      id={listboxId}
      role={listboxRole}
      hidden={hidden}
      onKeyDown={(e) => listboxKeyDown(e.nativeEvent)}
      ref={(el) => {
        injectListboxEl(el)
        if (typeof ref === 'function') ref(el)
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el
      }}
      style={safeStyle}
      aria-label={ariaLabel ?? listboxProps['aria-label']}
      className={cx('fc-select__listbox', className)}
    >
      {options.map((opt, index) => {
        const {
          id: optId,
          role: optRole,
          'aria-selected': ariaSelected,
          'aria-disabled': ariaDisabled,
          'data-highlighted': dataHighlighted,
          onClick: optClick,
          onMouseMove: optMouseMove,
        } = machine.getOptionProps(opt.value, index)
        return (
          <div
            key={opt.value}
            id={optId}
            role={optRole}
            aria-selected={ariaSelected}
            aria-disabled={ariaDisabled}
            // Present attribute = highlighted; absent = not highlighted (CSS [data-highlighted])
            data-highlighted={dataHighlighted ? '' : undefined}
            data-value={opt.value}
            onClick={optClick}
            onMouseMove={optMouseMove}
            className={cx('fc-select__option')}
          >
            <span className="fc-select__option-label">{opt.label}</span>
            <span className="fc-select__option-check" aria-hidden="true">
              {state.value === opt.value ? '✓' : ''}
            </span>
          </div>
        )
      })}
    </div>
  )
}
