import React, { useEffect, useRef } from 'react'
import { createToggle } from '@web-loom/foolscap-core'
import { useMachine } from '../hooks/useMachine'
import { useCallbackRef } from '../utils/useCallbackRef'
import { cx } from '../utils/cx'

export interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: React.ReactNode
}

export function Toggle({
  checked,
  defaultChecked,
  onCheckedChange,
  label,
  disabled,
  className,
  id,
  ...props
}: ToggleProps) {
  const stableOnChange = useCallbackRef(onCheckedChange)
  const machine = useMachine(() =>
    createToggle({ checked, defaultChecked, onCheckedChange: stableOnChange }),
  )

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    machine.setRootEl(inputRef.current)
    return () => machine.setRootEl(null)
  }, [machine])

  // In controlled mode the machine's state.checked is stale (captured at creation).
  // Read the controlled prop directly; fall back to machine state for uncontrolled.
  const isChecked = checked !== undefined ? checked : machine.state.checked

  return (
    <label
      className={cx('fc-toggle', disabled && 'fc-toggle--disabled', className)}
      htmlFor={id}
    >
      <input
        ref={inputRef}
        id={id}
        type="checkbox"
        role="switch"
        checked={isChecked}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        onChange={(e) => machine.setChecked(e.target.checked)}
        className="fc-toggle__input"
        {...props}
      />
      <span className="fc-toggle__track" aria-hidden="true" />
      {label != null && <span className="fc-toggle__label">{label}</span>}
    </label>
  )
}
