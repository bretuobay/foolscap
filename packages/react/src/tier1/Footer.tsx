import React from 'react'
import { cx } from '../utils/cx'

export interface FooterProps extends React.HTMLAttributes<HTMLElement>, React.RefAttributes<HTMLElement> {}

export function Footer({ className, ref, ...props }: FooterProps) {
  return <footer {...props} ref={ref} className={cx('fc-footer', className)} />
}

export interface FooterSectionProps extends React.HTMLAttributes<HTMLDivElement>, React.RefAttributes<HTMLDivElement> {}

export function FooterGrid({ className, ref, ...props }: FooterSectionProps) {
  return <div {...props} ref={ref} className={cx('fc-footer__grid', className)} />
}

export function FooterSectionTitle({ className, ref, ...props }: React.HTMLAttributes<HTMLHeadingElement> & React.RefAttributes<HTMLHeadingElement>) {
  return <h2 {...props} ref={ref} className={cx('fc-footer__section-title', className)} />
}

export function FooterLinks({ className, ref, ...props }: React.HTMLAttributes<HTMLUListElement> & React.RefAttributes<HTMLUListElement>) {
  return <ul {...props} ref={ref} className={cx('fc-footer__links', className)} />
}

export function FooterBottom({ className, ref, ...props }: FooterSectionProps) {
  return <div {...props} ref={ref} className={cx('fc-footer__bottom', className)} />
}
