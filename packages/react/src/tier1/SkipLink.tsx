import React from 'react'
import { cx } from '../utils/cx'

export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, React.RefAttributes<HTMLAnchorElement> {}

export function SkipLink({ className, ref, children = 'Skip to main content', ...props }: SkipLinkProps) {
  return (
    <a {...props} ref={ref} className={cx('fc-skip-link', className)}>
      {children}
    </a>
  )
}
