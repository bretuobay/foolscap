import React, { createContext, useCallback, useContext, useRef } from 'react'
import { createStepper, type Stepper as StepperMachine } from '@web-loom/foolscap-core'
import { useMachine } from '../hooks/useMachine'
import { useCallbackRef } from '../utils/useCallbackRef'
import { cx } from '../utils/cx'

interface StepperContextValue {
  machine: StepperMachine
  injectRootEl: (el: HTMLDivElement | null) => void
}

const StepperContext = createContext<StepperContextValue | null>(null)

function useStepperContext(): StepperContextValue {
  const ctx = useContext(StepperContext)
  if (!ctx) throw new Error('Stepper components must be used inside StepperRoot')
  return ctx
}

export interface StepperRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'>,
    React.RefAttributes<HTMLDivElement> {
  label: string
  min?: number
  max?: number
  step?: number
  largeStep?: number
  value?: number
  defaultValue?: number
  name?: string
  disabled?: boolean
  editable?: boolean
  size?: 'sm' | 'md' | 'lg'
  formatValue?: (value: number) => string
  onValueChange?: (value: number, prevValue: number) => void
  className?: string
  children?: React.ReactNode
}

export function StepperRoot({
  label,
  min,
  max,
  step,
  largeStep,
  value,
  defaultValue,
  name,
  disabled,
  editable,
  size,
  formatValue,
  onValueChange,
  className,
  children,
  ref,
  ...props
}: StepperRootProps) {
  const minRef = useRef(min)
  minRef.current = min
  const maxRef = useRef(max)
  maxRef.current = max
  const stepRef = useRef(step)
  stepRef.current = step
  const largeStepRef = useRef(largeStep)
  largeStepRef.current = largeStep
  const valueRef = useRef(value)
  valueRef.current = value
  const defaultValueRef = useRef(defaultValue)
  const nameRef = useRef(name)
  nameRef.current = name
  const disabledRef = useRef(disabled)
  disabledRef.current = disabled
  const editableRef = useRef(editable)
  editableRef.current = editable
  const formatValueRef = useRef(formatValue)
  formatValueRef.current = formatValue
  const stableOnValueChange = useCallbackRef(onValueChange)

  const machine = useMachine(() =>
    createStepper({
      get min() {
        return minRef.current
      },
      get max() {
        return maxRef.current
      },
      get step() {
        return stepRef.current
      },
      get largeStep() {
        return largeStepRef.current
      },
      get value() {
        return valueRef.current
      },
      defaultValue: defaultValueRef.current,
      get name() {
        return nameRef.current
      },
      get disabled() {
        return disabledRef.current
      },
      get editable() {
        return editableRef.current
      },
      get formatValue() {
        return formatValueRef.current
      },
      onValueChange: stableOnValueChange,
    })
  )

  const injectRootEl = useCallback((el: HTMLDivElement | null) => machine.setRootEl(el), [machine])
  const rootProps = machine.getRootProps()

  return (
    <StepperContext.Provider value={{ machine, injectRootEl }}>
      <div
        {...props}
        role={rootProps.role}
        aria-labelledby={rootProps['aria-labelledby']}
        data-state={rootProps['data-state']}
        data-size={size}
        ref={(el) => {
          injectRootEl(el)
          if (typeof ref === 'function') ref(el)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el
        }}
        className={cx('fc-stepper', className)}
      >
        {children ?? (
          <>
            <StepperLabel>{label}</StepperLabel>
            <div className="fc-stepper__controls">
              <StepperDecrement />
              <StepperInput />
              <StepperIncrement />
            </div>
            <StepperHiddenInput />
          </>
        )}
      </div>
    </StepperContext.Provider>
  )
}

export interface StepperLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string
}

export function StepperLabel({ className, ...props }: StepperLabelProps) {
  const { machine } = useStepperContext()
  const labelProps = machine.getLabelProps()
  return (
    <label
      {...props}
      id={props.id ?? labelProps.id}
      htmlFor={props.htmlFor ?? labelProps.htmlFor}
      className={cx('fc-stepper__label', className)}
    />
  )
}

export interface StepperButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

export function StepperDecrement({ className, children, ...props }: StepperButtonProps) {
  const { machine } = useStepperContext()
  const decrementProps = machine.getDecrementProps()
  return (
    <button
      {...props}
      type={decrementProps.type}
      aria-label={props['aria-label'] ?? decrementProps['aria-label']}
      aria-controls={decrementProps['aria-controls']}
      aria-disabled={decrementProps['aria-disabled']}
      disabled={props.disabled ?? decrementProps.disabled}
      onClick={decrementProps.onClick}
      onPointerDown={decrementProps.onPointerDown}
      onPointerUp={decrementProps.onPointerUp}
      onPointerCancel={decrementProps.onPointerCancel}
      onKeyUp={decrementProps.onKeyUp}
      className={cx('fc-stepper__decrement', className)}
    >
      {children ?? '−'}
    </button>
  )
}

export interface StepperInputProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function StepperInput({ className, ...props }: StepperInputProps) {
  const { machine } = useStepperContext()
  const inputProps = machine.getInputProps()
  return (
    <div
      {...props}
      id={props.id ?? inputProps.id}
      role={inputProps.role}
      tabIndex={inputProps.tabIndex}
      aria-labelledby={inputProps['aria-labelledby']}
      aria-valuemin={inputProps['aria-valuemin']}
      aria-valuemax={inputProps['aria-valuemax']}
      aria-valuenow={inputProps['aria-valuenow']}
      aria-valuetext={inputProps['aria-valuetext']}
      aria-disabled={inputProps['aria-disabled']}
      contentEditable={inputProps.contentEditable}
      suppressContentEditableWarning={inputProps.suppressContentEditableWarning}
      onKeyDown={(e) => inputProps.onKeyDown(e.nativeEvent)}
      onInput={(e) => inputProps.onInput(e.currentTarget.textContent ?? '')}
      onBlur={(e) => inputProps.onBlur(e.currentTarget.textContent ?? '')}
      className={cx('fc-stepper__input', className)}
    >
      {inputProps.children}
    </div>
  )
}

export function StepperIncrement({ className, children, ...props }: StepperButtonProps) {
  const { machine } = useStepperContext()
  const incrementProps = machine.getIncrementProps()
  return (
    <button
      {...props}
      type={incrementProps.type}
      aria-label={props['aria-label'] ?? incrementProps['aria-label']}
      aria-controls={incrementProps['aria-controls']}
      aria-disabled={incrementProps['aria-disabled']}
      disabled={props.disabled ?? incrementProps.disabled}
      onClick={incrementProps.onClick}
      onPointerDown={incrementProps.onPointerDown}
      onPointerUp={incrementProps.onPointerUp}
      onPointerCancel={incrementProps.onPointerCancel}
      onKeyUp={incrementProps.onKeyUp}
      className={cx('fc-stepper__increment', className)}
    >
      {children ?? '+'}
    </button>
  )
}

export interface StepperHiddenInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export function StepperHiddenInput({ className, ...props }: StepperHiddenInputProps) {
  const { machine } = useStepperContext()
  const inputProps = machine.getHiddenInputProps()
  if (!inputProps.name && !props.name) return null
  return (
    <input
      {...props}
      type={inputProps.type}
      name={props.name ?? inputProps.name}
      value={inputProps.value}
      readOnly
      className={cx('fc-stepper__hidden-input', className)}
    />
  )
}
