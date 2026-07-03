import React from 'react'
import { cx } from '../utils/cx'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement>, React.RefAttributes<HTMLLabelElement> {
  required?: boolean
}

export function Label({ required, className, ref, ...props }: LabelProps) {
  return (
    <label
      {...props}
      ref={ref}
      data-required={required ? 'true' : undefined}
      className={cx('fc-label', className)}
    />
  )
}
