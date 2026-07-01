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
import {
  createDrawer,
  type Drawer as DrawerMachine,
  type DrawerSide,
} from '@web-loom/foolscap-core'
import { useCallbackRef } from '../utils/useCallbackRef'
import { cx } from '../utils/cx'

export type { DrawerSide }

interface DrawerContextValue {
  close: () => void
  registerTitleId: (id: string | undefined) => void
}

const DrawerContext = createContext<DrawerContextValue | null>(null)

function useDrawerContext(): DrawerContextValue {
  const ctx = useContext(DrawerContext)
  if (!ctx) throw new Error('Drawer slot components must be used inside <Drawer>')
  return ctx
}

export interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  side?: DrawerSide
  size?: 'sm' | 'md' | 'lg'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  animationDuration?: number
  className?: string
  children: React.ReactNode
}

export function Drawer({
  open,
  onOpenChange,
  side = 'right',
  size,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  animationDuration = 250,
  className,
  children,
}: DrawerProps) {
  const panelRef = useRef<HTMLDialogElement>(null)
  const machineRef = useRef<DrawerMachine | null>(null)
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)
  const [labelledBy, setLabelledBy] = useState<string | undefined>()

  const stableOnOpenChange = useCallbackRef(onOpenChange)

  useEffect(() => {
    const el = panelRef.current
    if (!el) return

    const machine = createDrawer(el, {
      side,
      closeOnOverlayClick,
      closeOnEscape,
      animationDuration,
      onClose: () => stableOnOpenChange(false),
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

  const state = machineRef.current?.state ?? { status: 'closed' as const, side }
  const panelProps = machineRef.current?.getPanelProps()
  const overlayProps = machineRef.current?.getOverlayProps()

  return createPortal(
    <div
      className={cx('fc-drawer', className)}
      data-state={state.status}
      data-side={side}
      data-size={size}
    >
      <div
        className="fc-drawer__overlay"
        aria-hidden="true"
        onClick={overlayProps?.onClick}
      />
      <dialog
        ref={panelRef}
        className="fc-drawer__panel"
        aria-modal={true}
        aria-labelledby={labelledBy}
        onTransitionEnd={(e) => {
          if (e.target === panelRef.current) {
            panelProps?.onTransitionEnd(e.propertyName)
          }
        }}
      >
        <DrawerContext.Provider
          value={{
            close: () => machineRef.current?.close(),
            registerTitleId: setLabelledBy,
          }}
        >
          {children}
        </DrawerContext.Provider>
      </dialog>
    </div>,
    document.body
  )
}

export interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

export function DrawerHeader({ className, children, ...props }: DrawerHeaderProps) {
  return (
    <div className={cx('fc-drawer__header', className)} {...props}>
      {children}
    </div>
  )
}

export interface DrawerTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string
  children: React.ReactNode
}

export function DrawerTitle({ className, children, id, ...props }: DrawerTitleProps) {
  const reactId = useId().replace(/:/g, '')
  const generatedId = id ?? `fc-drawer-title-${reactId}`
  const { registerTitleId } = useDrawerContext()

  useEffect(() => {
    registerTitleId(generatedId)
    return () => registerTitleId(undefined)
  }, [generatedId, registerTitleId])

  return (
    <h2 id={generatedId} className={cx('fc-drawer__title', className)} {...props}>
      {children}
    </h2>
  )
}

export interface DrawerCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children?: React.ReactNode
}

export function DrawerClose({ className, children, onClick, ...props }: DrawerCloseProps) {
  const { close } = useDrawerContext()
  return (
    <button
      type="button"
      aria-label="Close drawer"
      className={cx('fc-drawer__close', className)}
      onClick={(e) => {
        close()
        onClick?.(e)
      }}
      {...props}
    >
      {children ?? '✕'}
    </button>
  )
}

export interface DrawerBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

export function DrawerBody({ className, children, ...props }: DrawerBodyProps) {
  return (
    <div className={cx('fc-drawer__body', className)} {...props}>
      {children}
    </div>
  )
}

export interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

export function DrawerFooter({ className, children, ...props }: DrawerFooterProps) {
  return (
    <div className={cx('fc-drawer__footer', className)} {...props}>
      {children}
    </div>
  )
}
