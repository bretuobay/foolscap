import React, { useId } from 'react'
import { cx } from '../utils/cx'

export interface RadioButtonProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>,
    React.RefAttributes<HTMLInputElement> {
  label: React.ReactNode
  rootClassName?: string
}

export function RadioButton({ label, rootClassName, className, id, ref, ...props }: RadioButtonProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className={cx('fc-radio-button', rootClassName)}>
      <input {...props} id={inputId} ref={ref} type="radio" className={cx('fc-radio-button__input', className)} />
      <span className="fc-radio-button__control" aria-hidden="true" />
      <label className="fc-radio-button__label" htmlFor={inputId}>
        {label}
      </label>
    </div>
  )
}
