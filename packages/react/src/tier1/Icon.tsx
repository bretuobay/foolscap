import React from 'react'
import { cx } from '../utils/cx'

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement>, React.RefAttributes<HTMLSpanElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  label?: string
}

export function Icon({ size = 'md', label, className, ref, ...props }: IconProps) {
  return (
    <span
      {...props}
      ref={ref}
      data-size={size}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cx('fc-icon', className)}
    />
  )
}
