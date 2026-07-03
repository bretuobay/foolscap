import React from 'react'
import { cx } from '../utils/cx'

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    React.RefAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error'
  live?: 'assertive' | 'polite'
  icon?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  dismissLabel?: string
  onDismiss?: () => void
}

export function Alert({
  variant = 'info',
  live = 'assertive',
  icon,
  title,
  description,
  dismissLabel = 'Dismiss alert',
  onDismiss,
  className,
  children,
  ref,
  role,
  ...props
}: AlertProps) {
  return (
    <div
      {...props}
      ref={ref}
      role={role ?? (live === 'polite' ? 'status' : 'alert')}
      data-variant={variant}
      data-live={live}
      className={cx('fc-alert', className)}
    >
      {icon && (
        <span className="fc-alert__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="fc-alert__body">
        {title && <p className="fc-alert__title">{title}</p>}
        {description ? <p className="fc-alert__description">{description}</p> : children}
      </div>
      {onDismiss && (
        <button className="fc-alert__dismiss" type="button" aria-label={dismissLabel} onClick={onDismiss}>
          x
        </button>
      )}
    </div>
  )
}
