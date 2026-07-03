import React, { createContext, useCallback, useContext, useRef } from 'react'
import { createRating, type Rating as RatingMachine } from '@web-loom/foolscap-core'
import { useMachine } from '../hooks/useMachine'
import { useCallbackRef } from '../utils/useCallbackRef'
import { cx } from '../utils/cx'

interface RatingContextValue {
  machine: RatingMachine
  injectRootEl: (el: HTMLDivElement | null) => void
  icon: React.ReactNode
}

const RatingContext = createContext<RatingContextValue | null>(null)

function useRatingContext(): RatingContextValue {
  const ctx = useContext(RatingContext)
  if (!ctx) throw new Error('Rating components must be used inside RatingRoot')
  return ctx
}

export interface RatingRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'>,
    React.RefAttributes<HTMLDivElement> {
  max?: number
  value?: number
  defaultValue?: number
  readOnly?: boolean
  disabled?: boolean
  name?: string
  icon?: React.ReactNode
  onValueChange?: (value: number) => void
  onHoverChange?: (value: number | null) => void
  className?: string
  children?: React.ReactNode
}

export function RatingRoot({
  max = 5,
  value,
  defaultValue,
  readOnly,
  disabled,
  name,
  icon = '★',
  onValueChange,
  onHoverChange,
  className,
  children,
  ref,
  ...props
}: RatingRootProps) {
  const maxRef = useRef(max)
  maxRef.current = max
  const valueRef = useRef(value)
  valueRef.current = value
  const defaultValueRef = useRef(defaultValue)
  const readOnlyRef = useRef(readOnly)
  readOnlyRef.current = readOnly
  const disabledRef = useRef(disabled)
  disabledRef.current = disabled
  const nameRef = useRef(name)
  nameRef.current = name
  const stableOnValueChange = useCallbackRef(onValueChange)
  const stableOnHoverChange = useCallbackRef(onHoverChange)

  const machine = useMachine(() =>
    createRating({
      get max() {
        return maxRef.current
      },
      get value() {
        return valueRef.current
      },
      defaultValue: defaultValueRef.current,
      get readOnly() {
        return readOnlyRef.current
      },
      get disabled() {
        return disabledRef.current
      },
      get name() {
        return nameRef.current
      },
      onValueChange: stableOnValueChange,
      onHoverChange: stableOnHoverChange,
    })
  )

  const injectRootEl = useCallback((el: HTMLDivElement | null) => machine.setRootEl(el), [machine])
  const rootProps = machine.getRootProps()

  return (
    <RatingContext.Provider value={{ machine, injectRootEl, icon }}>
      <div
        {...props}
        role={rootProps.role}
        aria-label={props['aria-label'] ?? rootProps['aria-label']}
        aria-required={rootProps['aria-required']}
        data-state={rootProps['data-state']}
        onMouseLeave={rootProps.onMouseLeave}
        ref={(el) => {
          injectRootEl(el)
          if (typeof ref === 'function') ref(el)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el
        }}
        className={cx('fc-rating', className)}
      >
        {children ?? <RatingItems />}
      </div>
    </RatingContext.Provider>
  )
}

export function RatingItems() {
  const { machine } = useRatingContext()
  const { max, isReadOnly } = machine.state
  const values = Array.from({ length: max }, (_, index) => index + 1)

  return (
    <>
      {!isReadOnly ? <RatingValueLabel /> : null}
      {values.map((value) =>
        isReadOnly ? <RatingReadOnlyIcon key={value} value={value} /> : <RatingItem key={value} value={value} />
      )}
    </>
  )
}

export interface RatingValueLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string
}

export function RatingValueLabel({ className, ...props }: RatingValueLabelProps) {
  const { machine } = useRatingContext()
  const { selectedValue, max } = machine.state
  const labelProps = machine.getValueLabelProps()
  return (
    <span {...props} aria-live={labelProps['aria-live']} className={cx('fc-rating__value-label', className)}>
      {selectedValue} out of {max} {max === 1 ? 'star' : 'stars'}
    </span>
  )
}

export interface RatingItemProps {
  value: number
  className?: string
}

export function RatingItem({ value, className }: RatingItemProps) {
  const { machine, icon } = useRatingContext()
  const itemProps = machine.getItemProps(value)
  const inputProps = machine.getInputProps(value)
  const iconProps = machine.getIconProps(value)

  return (
    <label
      data-state={itemProps['data-state']}
      onMouseEnter={itemProps.onMouseEnter}
      className={cx('fc-rating__item', className)}
    >
      <input
        className="fc-rating__input"
        type={inputProps.type}
        name={inputProps.name}
        value={inputProps.value}
        checked={inputProps.checked}
        disabled={inputProps.disabled}
        aria-label={inputProps['aria-label']}
        onChange={inputProps.onChange}
        onKeyDown={(e) => inputProps.onKeyDown(e.nativeEvent)}
      />
      <span className="fc-rating__icon" aria-hidden={iconProps['aria-hidden']}>
        {icon}
      </span>
    </label>
  )
}

export interface RatingReadOnlyIconProps {
  value: number
  className?: string
}

export function RatingReadOnlyIcon({ value, className }: RatingReadOnlyIconProps) {
  const { machine, icon } = useRatingContext()
  const itemProps = machine.getItemProps(value)
  const iconProps = machine.getIconProps(value)

  return (
    <span
      data-state={itemProps['data-state']}
      className={cx('fc-rating__item', className)}
    >
      <span className="fc-rating__icon" aria-hidden={iconProps['aria-hidden']}>
        {icon}
      </span>
    </span>
  )
}
