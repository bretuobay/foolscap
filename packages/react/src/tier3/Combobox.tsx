import React, { createContext, useCallback, useContext, useId, useRef } from 'react'
import {
  createCombobox,
  type Combobox as ComboboxMachine,
  type SelectOption,
} from '@web-loom/foolscap-core'
import { useMachine } from '../hooks/useMachine'
import { useCallbackRef } from '../utils/useCallbackRef'
import { cx } from '../utils/cx'

// ─── Context ──────────────────────────────────────────────────────────────────

interface ComboboxContextValue {
  machine: ComboboxMachine
  injectInputEl: (el: HTMLInputElement | null) => void
  injectListboxEl: (el: HTMLElement | null) => void
  inputId: string
  labelId: string
}

const ComboboxContext = createContext<ComboboxContextValue | null>(null)

function useComboboxContext(): ComboboxContextValue {
  const ctx = useContext(ComboboxContext)
  if (!ctx) throw new Error('ComboboxInput and ComboboxListbox must be used inside ComboboxRoot')
  return ctx
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export interface ComboboxRootProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onOpenChange?: (open: boolean) => void
  filterFn?: (option: SelectOption, inputValue: string) => boolean
  loading?: boolean
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  className?: string
  children: React.ReactNode
}

export function ComboboxRoot({
  options,
  value,
  defaultValue,
  onValueChange,
  onOpenChange,
  filterFn,
  loading,
  placement,
  className,
  children,
}: ComboboxRootProps) {
  const optionsRef = useRef(options)
  optionsRef.current = options
  const valueRef = useRef(value)
  valueRef.current = value
  const placementRef = useRef(placement)
  placementRef.current = placement
  const filterFnRef = useRef(filterFn)
  filterFnRef.current = filterFn
  const defaultValueRef = useRef(defaultValue)

  const stableOnValueChange = useCallbackRef(onValueChange)
  const stableOnOpenChange = useCallbackRef(onOpenChange)

  const machine = useMachine(() =>
    createCombobox({
      get options() { return optionsRef.current },
      get value() { return valueRef.current },
      defaultValue: defaultValueRef.current,
      get filterFn() { return filterFnRef.current },
      get loading() { return loading },
      get placement() { return placementRef.current },
      onValueChange: stableOnValueChange,
      onOpenChange: stableOnOpenChange,
    })
  )

  const injectInputEl = useCallback(
    (el: HTMLInputElement | null) => machine.setInputEl(el),
    [machine]
  )
  const injectListboxEl = useCallback(
    (el: HTMLElement | null) => machine.setListboxEl(el),
    [machine]
  )

  const reactId = useId().replace(/:/g, '')
  const inputId = `fc-combobox-input-${reactId}`
  const labelId = `fc-combobox-label-${reactId}`

  const state = machine.state

  return (
    <ComboboxContext.Provider value={{ machine, injectInputEl, injectListboxEl, inputId, labelId }}>
      <div
        className={cx('fc-combobox', className)}
        data-state={state.open ? 'open' : 'closed'}
      >
        {children}
      </div>
    </ComboboxContext.Provider>
  )
}

// ─── Input ─────────────────────────────────────────────────────────────────────

export interface ComboboxInputProps {
  label?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function ComboboxInput({ label, placeholder, disabled, className }: ComboboxInputProps) {
  const { machine, injectInputEl, inputId, labelId } = useComboboxContext()
  const state = machine.state
  const inputProps = machine.getInputProps()

  const {
    role,
    'aria-expanded': ariaExpanded,
    'aria-haspopup': ariaHaspopup,
    'aria-controls': ariaControls,
    'aria-activedescendant': ariaActivedescendant,
    'aria-autocomplete': ariaAutocomplete,
    value,
    onKeyDown: machineKeyDown,
    onFocus: machineFocus,
    onBlur: machineBlur,
  } = inputProps

  return (
    <>
      {label && (
        <label id={labelId} htmlFor={inputId} className="fc-combobox__label">
          {label}
        </label>
      )}
      <div className={cx('fc-combobox__input-wrapper', className)}>
        <input
          id={inputId}
          role={role}
          aria-expanded={ariaExpanded}
          aria-haspopup={ariaHaspopup}
          aria-controls={ariaControls}
          aria-activedescendant={ariaActivedescendant}
          aria-autocomplete={ariaAutocomplete}
          aria-labelledby={label ? labelId : undefined}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className="fc-combobox__input"
          ref={(el) => injectInputEl(el)}
          onChange={(e) => machine.setInputValue(e.target.value)}
          onKeyDown={(e) => machineKeyDown(e.nativeEvent)}
          onFocus={() => machineFocus()}
          onBlur={() => machineBlur()}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label="Toggle options"
          className="fc-combobox__toggle"
          onClick={() => (state.open ? machine.closeMenu() : machine.openMenu())}
        >
          ▾
        </button>
      </div>
    </>
  )
}

// ─── Listbox ───────────────────────────────────────────────────────────────────

export interface ComboboxListboxProps {
  emptyText?: string
  className?: string
  style?: React.CSSProperties
  ref?: React.Ref<HTMLUListElement>
}

export function ComboboxListbox({
  emptyText = 'No options found',
  className,
  style,
  ref,
}: ComboboxListboxProps) {
  const { machine, injectListboxEl } = useComboboxContext()
  const state = machine.state
  const listboxProps = machine.getListboxProps()

  const { id: listboxId, role: listboxRole, hidden } = listboxProps

  // Strip display — machine owns style.display via inline assignment
  const { display: _display, ...safeStyle } = (style ?? {}) as React.CSSProperties & { display?: string }

  return (
    <ul
      id={listboxId}
      role={listboxRole}
      hidden={hidden}
      style={safeStyle}
      className={cx('fc-combobox__listbox', className)}
      ref={(el) => {
        injectListboxEl(el)
        if (typeof ref === 'function') ref(el)
        else if (ref) (ref as React.MutableRefObject<HTMLUListElement | null>).current = el
      }}
    >
      {state.filteredOptions.length === 0 ? (
        <li className="fc-combobox__empty">{emptyText}</li>
      ) : (
        state.filteredOptions.map((opt, index) => {
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
            <li
              key={opt.value}
              id={optId}
              role={optRole}
              aria-selected={ariaSelected}
              aria-disabled={ariaDisabled}
              data-highlighted={dataHighlighted ? '' : undefined}
              data-value={opt.value}
              onClick={optClick}
              onMouseMove={optMouseMove}
              className="fc-combobox__option"
            >
              {opt.label}
            </li>
          )
        })
      )}
    </ul>
  )
}
