import React from 'react'
import { cx } from '../utils/cx'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    React.RefAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  iconStart?: React.ReactNode
  iconEnd?: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  iconStart,
  iconEnd,
  className,
  children,
  ref,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type="button"
      data-variant={variant}
      data-size={size}
      data-state={loading ? 'loading' : undefined}
      aria-disabled={loading || disabled || undefined}
      disabled={disabled}
      className={cx('fc-button', className)}
      {...props}
    >
      {iconStart && (
        <span className="fc-button__icon-start" aria-hidden="true">
          {iconStart}
        </span>
      )}
      <span className="fc-button__label">{children}</span>
      {iconEnd && (
        <span className="fc-button__icon-end" aria-hidden="true">
          {iconEnd}
        </span>
      )}
    </button>
  )
}
