import React from 'react'
import { cx } from '../utils/cx'

export interface HeroProps extends React.HTMLAttributes<HTMLElement>, React.RefAttributes<HTMLElement> {
  variant?: 'default' | 'split'
}

export function Hero({ variant = 'default', className, ref, ...props }: HeroProps) {
  return (
    <section
      {...props}
      ref={ref}
      data-variant={variant === 'default' ? undefined : variant}
      className={cx('fc-hero', className)}
    />
  )
}

export function HeroEyebrow({ className, ref, ...props }: React.HTMLAttributes<HTMLParagraphElement> & React.RefAttributes<HTMLParagraphElement>) {
  return <p {...props} ref={ref} className={cx('fc-hero__eyebrow', className)} />
}

export function HeroTitle({ className, ref, ...props }: React.HTMLAttributes<HTMLHeadingElement> & React.RefAttributes<HTMLHeadingElement>) {
  return <h1 {...props} ref={ref} className={cx('fc-hero__title', className)} />
}

export function HeroDescription({ className, ref, ...props }: React.HTMLAttributes<HTMLParagraphElement> & React.RefAttributes<HTMLParagraphElement>) {
  return <p {...props} ref={ref} className={cx('fc-hero__description', className)} />
}

export function HeroActions({ className, ref, ...props }: React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>) {
  return <div {...props} ref={ref} className={cx('fc-hero__actions', className)} />
}
