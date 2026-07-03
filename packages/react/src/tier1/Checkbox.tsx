import React, { useEffect, useId, useRef } from 'react'
import { cx } from '../utils/cx'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>,
    React.RefAttributes<HTMLInputElement> {
  label: React.ReactNode
  hint?: React.ReactNode
  indeterminate?: boolean
  rootClassName?: string
}

export function Checkbox({
  label,
  hint,
  indeterminate,
  rootClassName,
  className,
  id,
  ref,
  ...props
}: CheckboxProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = Boolean(indeterminate)
  }, [indeterminate])

  return (
    <div className={cx('fc-checkbox', rootClassName)} data-state={indeterminate ? 'indeterminate' : undefined}>
      <input
        {...props}
        id={inputId}
        ref={(el) => {
          inputRef.current = el
          if (typeof ref === 'function') ref(el)
          else if (ref) ref.current = el
        }}
        type="checkbox"
        aria-checked={indeterminate ? 'mixed' : props['aria-checked']}
        className={cx('fc-checkbox__input', className)}
      />
      <span className="fc-checkbox__control" aria-hidden="true" />
      <label className="fc-checkbox__label" htmlFor={inputId}>
        {label}
      </label>
      {hint && <p className="fc-checkbox__hint">{hint}</p>}
    </div>
  )
}
