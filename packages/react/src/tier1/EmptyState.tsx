import React from 'react'
import { cx } from '../utils/cx'

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    React.RefAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action, className, children, ref, ...props }: EmptyStateProps) {
  return (
    <div {...props} ref={ref} className={cx('fc-empty-state', className)}>
      {icon && <div className="fc-empty-state__icon">{icon}</div>}
      {title && <div className="fc-empty-state__title">{title}</div>}
      {description && <div className="fc-empty-state__description">{description}</div>}
      {children}
      {action && <div className="fc-empty-state__action">{action}</div>}
    </div>
  )
}
