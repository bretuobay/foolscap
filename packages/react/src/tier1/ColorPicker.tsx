import React, { useId, useState } from 'react'
import { cx } from '../utils/cx'

export interface ColorPickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>,
    React.RefAttributes<HTMLInputElement> {
  label: React.ReactNode
  rootClassName?: string
  showValue?: boolean
}

export function ColorPicker({
  label,
  rootClassName,
  className,
  id,
  value,
  defaultValue = '#000000',
  showValue = true,
  onChange,
  ref,
  ...props
}: ColorPickerProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const [uncontrolledValue, setUncontrolledValue] = useState(String(defaultValue))
  const displayValue = String(value ?? uncontrolledValue)

  return (
    <div className={cx('fc-color-picker', rootClassName)}>
      <label className="fc-color-picker__label" htmlFor={inputId}>
        {label}
      </label>
      <span className="fc-color-picker__swatch" style={{ backgroundColor: displayValue }}>
        <input
          {...props}
          id={inputId}
          ref={ref}
          type="color"
          value={value}
          defaultValue={value == null ? defaultValue : undefined}
          onChange={(event) => {
            if (value == null) setUncontrolledValue(event.currentTarget.value)
            onChange?.(event)
          }}
          className={cx('fc-color-picker__input', className)}
        />
      </span>
      {showValue && <span className="fc-color-picker__value">{displayValue}</span>}
    </div>
  )
}
