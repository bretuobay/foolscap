import React from 'react'
import { cx } from '../utils/cx'

export interface HeaderProps extends React.HTMLAttributes<HTMLElement>, React.RefAttributes<HTMLElement> {}

export function Header({ className, ref, ...props }: HeaderProps) {
  return <header {...props} ref={ref} className={cx('fc-header', className)} />
}

export function HeaderBrand({ className, ref, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & React.RefAttributes<HTMLAnchorElement>) {
  return <a {...props} ref={ref} className={cx('fc-header__brand', className)} />
}

export function HeaderNav({ className, ref, ...props }: React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>) {
  return <nav {...props} ref={ref} className={cx('fc-header__nav', className)} />
}

export function HeaderActions({ className, ref, ...props }: React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>) {
  return <div {...props} ref={ref} className={cx('fc-header__actions', className)} />
}
