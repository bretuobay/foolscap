import React from 'react'
import { cx } from '../utils/cx'

export interface CardProps extends React.HTMLAttributes<HTMLElement>, React.RefAttributes<HTMLElement> {
  variant?: 'default' | 'flat' | 'elevated'
  as?: 'article' | 'div' | 'section'
}

export function Card({ variant = 'default', as = 'article', className, ref, ...props }: CardProps) {
  return React.createElement(as, {
    ...props,
    ref,
    'data-variant': variant === 'default' ? undefined : variant,
    className: cx('fc-card', className),
  })
}

export interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement>, React.RefAttributes<HTMLDivElement> {}

export function CardMedia({ className, ref, ...props }: CardSectionProps) {
  return <div {...props} ref={ref} className={cx('fc-card__media', className)} />
}

export function CardBody({ className, ref, ...props }: CardSectionProps) {
  return <div {...props} ref={ref} className={cx('fc-card__body', className)} />
}

export function CardTitle({ className, ref, ...props }: React.HTMLAttributes<HTMLHeadingElement> & React.RefAttributes<HTMLHeadingElement>) {
  return <h3 {...props} ref={ref} className={cx('fc-card__title', className)} />
}

export function CardDescription({ className, ref, ...props }: React.HTMLAttributes<HTMLParagraphElement> & React.RefAttributes<HTMLParagraphElement>) {
  return <p {...props} ref={ref} className={cx('fc-card__description', className)} />
}

export function CardFooter({ className, ref, ...props }: CardSectionProps) {
  return <div {...props} ref={ref} className={cx('fc-card__footer', className)} />
}
