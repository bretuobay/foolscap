import React from 'react'
import { cx } from '../utils/cx'

export interface ListProps
  extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement>,
    React.RefAttributes<HTMLUListElement | HTMLOListElement> {
  variant?: 'bulleted' | 'numbered' | 'plain'
}

export function List({ variant = 'bulleted', className, ref, ...props }: ListProps) {
  const Component = variant === 'numbered' ? 'ol' : 'ul'
  return (
    <Component
      {...props}
      ref={ref as React.Ref<HTMLOListElement & HTMLUListElement>}
      data-variant={variant}
      className={cx('fc-list', className)}
    />
  )
}
