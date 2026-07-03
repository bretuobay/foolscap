import React from 'react'
import { cx } from '../utils/cx'

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement>, React.RefAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}

export function Separator({
  orientation = 'horizontal',
  decorative = true,
  className,
  ref,
  ...props
}: SeparatorProps) {
  return (
    <div
      {...props}
      ref={ref}
      role={decorative ? 'presentation' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      data-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      className={cx('fc-separator', className)}
    />
  )
}
