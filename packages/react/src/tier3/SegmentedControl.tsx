import React, { createContext, useCallback, useContext, useRef } from 'react'
import {
  createSegmentedControl,
  type SegmentedControl as SegmentedControlMachine,
  type SegmentedControlItem,
  type SegmentedControlMode,
} from '@web-loom/foolscap-core'
import { useMachine } from '../hooks/useMachine'
import { useCallbackRef } from '../utils/useCallbackRef'
import { cx } from '../utils/cx'

interface SegmentedControlContextValue {
  machine: SegmentedControlMachine
  items: SegmentedControlItem[]
  injectRootEl: (el: HTMLElement | null) => void
  injectItemEl: (value: string, el: HTMLElement | null) => void
}

const SegmentedControlContext = createContext<SegmentedControlContextValue | null>(null)

function useSegmentedControlContext(): SegmentedControlContextValue {
  const ctx = useContext(SegmentedControlContext)
  if (!ctx) throw new Error('SegmentedControl components must be used inside SegmentedControlRoot')
  return ctx
}

export type { SegmentedControlItem, SegmentedControlMode }

export interface SegmentedControlRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'>,
    React.RefAttributes<HTMLDivElement> {
  items: SegmentedControlItem[]
  value?: string
  defaultValue?: string
  mode?: SegmentedControlMode
  name?: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  onValueChange?: (value: string, prevValue: string | null) => void
  className?: string
  children?: React.ReactNode
}

export function SegmentedControlRoot({
  items,
  value,
  defaultValue,
  mode = 'radio',
  name,
  label = 'Segmented control',
  size,
  fullWidth,
  onValueChange,
  className,
  children,
  ref,
  ...props
}: SegmentedControlRootProps) {
  const itemsRef = useRef(items)
  itemsRef.current = items
  const valueRef = useRef(value)
  valueRef.current = value
  const defaultValueRef = useRef(defaultValue)
  const nameRef = useRef(name)
  nameRef.current = name
  const stableOnValueChange = useCallbackRef(onValueChange)

  const machine = useMachine(() =>
    createSegmentedControl({
      get items() {
        return itemsRef.current
      },
      get value() {
        return valueRef.current
      },
      defaultValue: defaultValueRef.current,
      mode,
      get name() {
        return nameRef.current
      },
      onValueChange: stableOnValueChange,
    })
  )

  const injectRootEl = useCallback((el: HTMLElement | null) => machine.setRootEl(el), [machine])
  const injectItemEl = useCallback(
    (itemValue: string, el: HTMLElement | null) => machine.setItemEl(itemValue, el),
    [machine]
  )
  const rootProps = machine.getRootProps()

  return (
    <SegmentedControlContext.Provider value={{ machine, items, injectRootEl, injectItemEl }}>
      <div
        {...props}
        role={rootProps.role}
        aria-label={props['aria-label'] ?? label}
        data-mode={rootProps['data-mode']}
        data-size={size}
        data-full-width={fullWidth ? '' : undefined}
        ref={(el) => {
          injectRootEl(el)
          if (typeof ref === 'function') ref(el)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el
        }}
        className={cx('fc-segmented-control', className)}
      >
        <SegmentedControlIndicator />
        {children ?? items.map((item) => <SegmentedControlItemView key={item.value} item={item} />)}
      </div>
    </SegmentedControlContext.Provider>
  )
}

export interface SegmentedControlIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string
}

export function SegmentedControlIndicator({ className, ...props }: SegmentedControlIndicatorProps) {
  const { machine } = useSegmentedControlContext()
  return (
    <span
      {...props}
      {...machine.getIndicatorProps()}
      className={cx('fc-segmented-control__indicator', className)}
    />
  )
}

export interface SegmentedControlItemProps {
  item: SegmentedControlItem
  icon?: React.ReactNode
  className?: string
}

export function SegmentedControlItemView({ item, icon, className }: SegmentedControlItemProps) {
  const { machine, injectItemEl } = useSegmentedControlContext()
  const rootMode = machine.state.mode
  const itemProps = machine.getItemProps(item.value)
  const inputProps = machine.getInputProps(item.value)

  if (rootMode === 'tabs') {
    return (
      <button
        type="button"
        role={itemProps.role}
        id={itemProps.id}
        aria-selected={itemProps['aria-selected']}
        aria-disabled={itemProps['aria-disabled']}
        aria-controls={itemProps['aria-controls']}
        tabIndex={itemProps.tabIndex}
        data-state={itemProps['data-state']}
        disabled={item.disabled}
        onClick={itemProps.onClick}
        onKeyDown={(e) => itemProps.onKeyDown(e.nativeEvent)}
        ref={(el) => injectItemEl(item.value, el)}
        className={cx('fc-segmented-control__item', className)}
      >
        {icon ? <span className="fc-segmented-control__icon" aria-hidden="true">{icon}</span> : null}
        <span className="fc-segmented-control__label-text">{item.label}</span>
      </button>
    )
  }

  return (
    <label
      data-state={itemProps['data-state']}
      ref={(el) => injectItemEl(item.value, el)}
      className={cx('fc-segmented-control__item', className)}
    >
      <input
        className="fc-segmented-control__input"
        type={inputProps.type}
        name={inputProps.name}
        value={inputProps.value}
        checked={inputProps.checked}
        disabled={inputProps.disabled}
        onChange={inputProps.onChange}
        onKeyDown={(e) => itemProps.onKeyDown(e.nativeEvent)}
      />
      {icon ? <span className="fc-segmented-control__icon" aria-hidden="true">{icon}</span> : null}
      <span className="fc-segmented-control__label-text">{item.label}</span>
    </label>
  )
}
