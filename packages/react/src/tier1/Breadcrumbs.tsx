import React from 'react'
import { cx } from '../utils/cx'

export interface BreadcrumbsProps
  extends React.OlHTMLAttributes<HTMLOListElement>,
    React.RefAttributes<HTMLOListElement> {
  label?: string
}

export function Breadcrumbs({ label = 'Breadcrumb', className, ref, ...props }: BreadcrumbsProps) {
  return (
    <nav aria-label={label}>
      <ol {...props} ref={ref} className={cx('fc-breadcrumbs', className)} />
    </nav>
  )
}

export interface BreadcrumbItemProps extends React.LiHTMLAttributes<HTMLLIElement>, React.RefAttributes<HTMLLIElement> {}

export function BreadcrumbItem({ ref, ...props }: BreadcrumbItemProps) {
  return <li {...props} ref={ref} />
}
