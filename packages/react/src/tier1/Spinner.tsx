import React from 'react'
import { cx } from '../utils/cx'

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement>, React.RefAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export function Spinner({ size = 'md', label = 'Loading', className, ref, ...props }: SpinnerProps) {
  return (
    <span
      {...props}
      ref={ref}
      role="status"
      data-size={size}
      aria-label={label}
      className={cx('fc-spinner', className)}
    />
  )
}
