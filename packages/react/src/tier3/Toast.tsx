import React from 'react'
import { createPortal } from 'react-dom'
import { createToaster, type Toast } from '@web-loom/foolscap-core'
import { useMachine } from '../hooks/useMachine'
import { useSubscription } from '../hooks/useSubscription'
import { ToastContext, useToastContext } from '../hooks/useToastContext'
import { cx } from '../utils/cx'

export { useToastContext }

// Provider

export interface ToastProviderProps {
  limit?: number
  defaultDuration?: number
  children: React.ReactNode
}

export function ToastProvider({ limit, defaultDuration, children }: ToastProviderProps) {
  const machine = useMachine(() => createToaster({ limit, defaultDuration }))
  return <ToastContext.Provider value={machine}>{children}</ToastContext.Provider>
}

// Toaster — live region rendered into a portal

export interface ToasterProps {
  position?: 'top' | 'top-right' | 'bottom-right' | 'bottom'
  className?: string
}

export function Toaster({ position = 'bottom-right', className }: ToasterProps) {
  const machine = useToastContext()
  useSubscription(machine)

  return createPortal(
    <div
      {...machine.getRegionProps()}
      className={cx('fc-toast-region', `fc-toast-region--${position}`, className)}
    >
      {machine.state.toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>,
    document.body,
  )
}

// ToastItem

export interface ToastItemProps {
  toast: Toast
  className?: string
}

export function ToastItem({ toast, className }: ToastItemProps) {
  const machine = useToastContext()

  return (
    <div
      {...machine.getToastProps(toast.id)}
      data-type={toast.type}
      className={cx('fc-toast', className)}
    >
      <div className="fc-toast__content">
        <p className="fc-toast__title">{toast.title}</p>
        {toast.description && <p className="fc-toast__description">{toast.description}</p>}
      </div>
      {toast.action && (
        <button type="button" className="fc-toast__action" onClick={toast.action.onClick}>
          {toast.action.label}
        </button>
      )}
      <button
        {...machine.getDismissButtonProps(toast.id)}
        type="button"
        className="fc-toast__dismiss"
      />
    </div>
  )
}
