import React from 'react'
import { cx } from '../utils/cx'

export interface DateInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>,
    React.RefAttributes<HTMLInputElement> {}

export function DateInput({ className, ref, ...props }: DateInputProps) {
  return <input {...props} ref={ref} type="date" className={cx('fc-date-input', className)} />
}
