import React from 'react'
import { cx } from '../utils/cx'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, React.RefAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'subtle'
}

export function Badge({ variant = 'default', className, ref, ...props }: BadgeProps) {
  return (
    <span
      {...props}
      ref={ref}
      data-variant={variant === 'default' ? undefined : variant}
      className={cx('fc-badge', className)}
    />
  )
}
