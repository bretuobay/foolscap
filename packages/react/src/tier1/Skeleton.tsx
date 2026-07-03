import React from 'react'
import { cx } from '../utils/cx'

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement>, React.RefAttributes<HTMLSpanElement> {
  variant?: 'block' | 'text' | 'circle'
}

export function Skeleton({ variant = 'block', className, ref, ...props }: SkeletonProps) {
  return (
    <span
      {...props}
      ref={ref}
      aria-hidden="true"
      data-variant={variant === 'block' ? undefined : variant}
      className={cx('fc-skeleton', className)}
    />
  )
}
