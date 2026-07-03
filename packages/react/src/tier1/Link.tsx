import React from 'react'
import { cx } from '../utils/cx'

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, React.RefAttributes<HTMLAnchorElement> {}

export function Link({ className, ref, ...props }: LinkProps) {
  return <a {...props} ref={ref} className={cx('fc-link', className)} />
}
