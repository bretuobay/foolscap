import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useReducer,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { createModal, type Modal as ModalMachine } from '@web-loom/foolscap-core'
import { useCallbackRef } from '../utils/useCallbackRef'
import { cx } from '../utils/cx'

interface ModalContextValue {
  close: () => void
  registerTitleId: (id?: string) => void
  registerBodyId: (id?: string) => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

function useModalContext(): ModalContextValue {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('Modal slot components must be used inside <Modal>')
  return ctx
}

export interface ModalProps extends Omit<
  React.DialogHTMLAttributes<HTMLDialogElement>,
  'open' | 'onClose' | 'children' | 'role' | 'aria-modal' | 'aria-labelledby' | 'aria-describedby'
> {
  open: boolean
  onClose: () => void
  variant?: 'default' | 'alert'
  size?: 'sm' | 'md' | 'lg' | 'full'
  closeOnBackdropClick?: boolean
  animationDuration?: number
  className?: string
  children: React.ReactNode
}

export function Modal({
  open,
  onClose,
  variant = 'default',
  size = 'md',
  closeOnBackdropClick = true,
  animationDuration = 200,
  className,
  children,
  ...props
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const machineRef = useRef<ModalMachine | null>(null)
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)
  const [labelledBy, setLabelledBy] = useState<string>()
  const [describedBy, setDescribedBy] = useState<string>()

  const stableOnClose = useCallbackRef(onClose)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return

    const machine = createModal(el, {
      closeOnBackdropClick,
      animationDuration,
      onClose: stableOnClose,
    })
    machineRef.current = machine
    const unsubscribe = machine.subscribe(() => forceUpdate())

    return () => {
      unsubscribe()
      machine.destroy()
      machineRef.current = null
    }
  }, [])

  useEffect(() => {
    const machine = machineRef.current
    if (!machine) return
    if (open) machine.open()
    else machine.close()
  }, [open])

  const rootProps = machineRef.current?.getRootProps()
  const dialogOpen = dialogRef.current?.open ?? false
  const handleAnimationEnd: React.AnimationEventHandler<HTMLDialogElement> = (event) => {
    props.onAnimationEnd?.(event)
    rootProps?.onAnimationEnd()
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      {...props}
      aria-modal={true}
      aria-labelledby={labelledBy}
      aria-describedby={variant === 'alert' ? describedBy : undefined}
      role={variant === 'alert' ? 'alertdialog' : 'dialog'}
      data-state={dialogOpen ? 'open' : 'closed'}
      data-variant={variant}
      data-size={size}
      onAnimationEnd={handleAnimationEnd}
      className={cx(
        'fc-modal',
        variant !== 'default' && `fc-modal--${variant}`,
        size !== 'md' && `fc-modal--${size}`,
        className
      )}
    >
      <ModalContext.Provider
        value={{
          close: () => machineRef.current?.close(),
          registerTitleId: setLabelledBy,
          registerBodyId: setDescribedBy,
        }}
      >
        {children}
      </ModalContext.Provider>
    </dialog>,
    document.body
  )
}

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

export function ModalHeader({ className, children, ...props }: ModalHeaderProps) {
  return (
    <div className={cx('fc-modal__header', className)} {...props}>
      {children}
    </div>
  )
}

export interface ModalTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string
  children: React.ReactNode
}

export function ModalTitle({ className, children, id, ...props }: ModalTitleProps) {
  const reactId = useId().replace(/:/g, '')
  const generatedId = id ?? `fc-modal-title-${reactId}`
  const { registerTitleId } = useModalContext()

  useEffect(() => {
    registerTitleId(generatedId)
    return () => registerTitleId(undefined)
  }, [generatedId, registerTitleId])

  return (
    <h2 id={generatedId} className={cx('fc-modal__title', className)} {...props}>
      {children}
    </h2>
  )
}

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

export function ModalBody({ className, children, id, ...props }: ModalBodyProps) {
  const reactId = useId().replace(/:/g, '')
  const generatedId = id ?? `fc-modal-body-${reactId}`
  const { registerBodyId } = useModalContext()

  useEffect(() => {
    registerBodyId(generatedId)
    return () => registerBodyId(undefined)
  }, [generatedId, registerBodyId])

  return (
    <div id={generatedId} className={cx('fc-modal__body', className)} {...props}>
      {children}
    </div>
  )
}

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

export function ModalFooter({ className, children, ...props }: ModalFooterProps) {
  return (
    <div className={cx('fc-modal__footer', className)} {...props}>
      {children}
    </div>
  )
}

export interface ModalCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children?: React.ReactNode
}

export function ModalClose({ className, children, onClick, ...props }: ModalCloseProps) {
  const { close } = useModalContext()
  return (
    <button
      type="button"
      aria-label="Close modal"
      className={cx('fc-modal__close', className)}
      onClick={(e) => {
        close()
        onClick?.(e)
      }}
      {...props}
    >
      {children}
    </button>
  )
}
