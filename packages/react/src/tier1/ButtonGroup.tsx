import React from 'react'
import { cx } from '../utils/cx'

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement>, React.RefAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
}

export function ButtonGroup({ orientation = 'horizontal', className, ref, ...props }: ButtonGroupProps) {
  return (
    <div
      {...props}
      ref={ref}
      role={props.role ?? 'group'}
      data-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      className={cx('fc-button-group', className)}
    />
  )
}
