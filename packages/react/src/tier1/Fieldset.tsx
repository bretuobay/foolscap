import React from 'react'
import { cx } from '../utils/cx'

export interface FieldsetProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
    React.RefAttributes<HTMLFieldSetElement> {
  legend: React.ReactNode
  hint?: React.ReactNode
}

export function Fieldset({ legend, hint, className, children, ref, ...props }: FieldsetProps) {
  return (
    <fieldset {...props} ref={ref} className={cx('fc-fieldset', className)}>
      <legend className="fc-fieldset__legend">{legend}</legend>
      {hint && <p className="fc-fieldset__hint">{hint}</p>}
      <div className="fc-fieldset__body">{children}</div>
    </fieldset>
  )
}
