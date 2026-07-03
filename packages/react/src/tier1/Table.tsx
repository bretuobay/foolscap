import React from 'react'
import { cx } from '../utils/cx'

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement>, React.RefAttributes<HTMLTableElement> {
  variant?: 'default' | 'striped' | 'bordered'
}

export function Table({ variant = 'default', className, ref, ...props }: TableProps) {
  return (
    <table
      {...props}
      ref={ref}
      data-variant={variant === 'default' ? undefined : variant}
      className={cx('fc-table', className)}
    />
  )
}
