import React from 'react'
import { cx } from '../utils/cx'

export interface QuoteProps
  extends React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
    React.RefAttributes<HTMLQuoteElement> {
  variant?: 'default' | 'pull'
  citeText?: React.ReactNode
}

export function Quote({ variant = 'default', citeText, className, children, ref, ...props }: QuoteProps) {
  return (
    <blockquote
      {...props}
      ref={ref}
      data-variant={variant === 'default' ? undefined : variant}
      className={cx('fc-quote', className)}
    >
      {children}
      {citeText && <cite className="fc-quote__cite">{citeText}</cite>}
    </blockquote>
  )
}
