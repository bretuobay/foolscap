import React, {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import { createPopover, type Popover as PopoverMachine } from '@web-loom/foolscap-core'
import { useCallbackRef } from '../utils/useCallbackRef'
import { cx } from '../utils/cx'

type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right'

interface PopoverContextValue {
  machine: PopoverMachine | null
  placement: PopoverPlacement
  setTriggerEl: (el: HTMLElement | null) => void
  setContentEl: (el: HTMLElement | null) => void
  close: () => void
}

const PopoverContext = createContext<PopoverContextValue | null>(null)

function usePopoverContext(): PopoverContextValue {
  const ctx = useContext(PopoverContext)
  if (!ctx) throw new Error('PopoverTrigger and PopoverContent must be used inside PopoverRoot')
  return ctx
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null): void {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref && typeof ref === 'object') {
    ;(ref as React.MutableRefObject<T | null>).current = value
  }
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    refs.forEach((ref) => assignRef(ref, value))
  }
}

function mergeHandlers<E>(
  first?: (event: E) => void,
  second?: (event: E) => void
): (event: E) => void {
  return (event: E) => {
    first?.(event)
    second?.(event)
  }
}

function getElementRef<T>(element: React.ReactElement<T>): React.Ref<unknown> | undefined {
  const typedElement = element as React.ReactElement<T> & {
    ref?: React.Ref<unknown>
    props: T & { ref?: React.Ref<unknown> }
  }
  return typedElement.ref ?? typedElement.props.ref
}

export interface PopoverRootProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  placement?: PopoverPlacement
  offset?: number
  children: React.ReactNode
}

export function PopoverRoot({
  open,
  defaultOpen,
  onOpenChange,
  placement = 'bottom',
  offset = 8,
  children,
}: PopoverRootProps) {
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null)
  const [contentEl, setContentEl] = useState<HTMLElement | null>(null)
  const machineRef = useRef<PopoverMachine | null>(null)
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)
  const stableOnOpenChange = useCallbackRef(onOpenChange)
  const didApplyDefaultOpen = useRef(false)

  useEffect(() => {
    if (!triggerEl || !contentEl) return

    const machine = createPopover(triggerEl, contentEl, {
      placement,
      offset,
      onOpen: () => stableOnOpenChange(true),
      onClose: () => stableOnOpenChange(false),
    })

    machineRef.current = machine
    const unsubscribe = machine.subscribe(() => forceUpdate())
    forceUpdate()

    if (defaultOpen && !didApplyDefaultOpen.current) {
      didApplyDefaultOpen.current = true
      void machine.open()
    }

    return () => {
      unsubscribe()
      machine.destroy()
      machineRef.current = null
    }
  }, [triggerEl, contentEl, placement, offset, defaultOpen, stableOnOpenChange])

  useEffect(() => {
    const machine = machineRef.current
    if (!machine || open === undefined) return
    if (open && !machine.state.open) {
      void machine.open()
    } else if (!open && machine.state.open) {
      machine.close()
    }
  }, [open])

  const machine = machineRef.current

  return (
    <PopoverContext.Provider
      value={{
        machine,
        placement,
        setTriggerEl,
        setContentEl,
        close: () => machine?.close(),
      }}
    >
      {children}
    </PopoverContext.Provider>
  )
}

export interface PopoverTriggerProps {
  asChild?: boolean
  children: React.ReactElement
}

export function PopoverTrigger({ asChild = true, children }: PopoverTriggerProps) {
  const { machine, setTriggerEl } = usePopoverContext()
  void asChild

  const triggerProps = machine?.getTriggerProps()
  const contentProps = machine?.getContentProps()
  const childProps = children.props as Record<string, unknown>

  const mergedProps = {
    ...triggerProps,
    'aria-haspopup': 'dialog',
    'aria-expanded': triggerProps?.['aria-expanded'] ?? false,
    'aria-controls': contentProps?.id ?? triggerProps?.['aria-controls'],
    onClick: mergeHandlers(
      childProps.onClick as ((event: unknown) => void) | undefined,
      triggerProps?.onClick
    ),
    ref: mergeRefs(getElementRef(children), setTriggerEl),
  }

  return cloneElement(children, mergedProps)
}

export interface PopoverContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    React.RefAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

export function PopoverContent({ className, children, ref, style, ...props }: PopoverContentProps) {
  const { machine, placement, setContentEl } = usePopoverContext()
  const contentProps = machine?.getContentProps()

  // Strip `display` from user styles — the machine owns style.display via inline assignment
  // and React must not overwrite it on every re-render.
  const { display: _display, ...safeStyle } = (style ?? {}) as React.CSSProperties & {
    display?: string
  }

  return (
    <div
      {...props}
      {...contentProps}
      ref={mergeRefs(ref, setContentEl)}
      style={safeStyle}
      data-state={contentProps?.['data-state'] ?? 'closed'}
      data-placement={placement}
      hidden={contentProps?.hidden ?? true}
      className={cx('fc-popover', className)}
    >
      <span className="fc-popover__arrow" aria-hidden="true" />
      {children}
    </div>
  )
}

export interface PopoverCloseProps {
  children: React.ReactElement
}

export function PopoverClose({ children }: PopoverCloseProps) {
  const { close } = usePopoverContext()
  const childProps = children.props as Record<string, unknown>
  const childElement = children as React.ReactElement<any>

  return cloneElement(childElement, {
    onClick: mergeHandlers(childProps.onClick as ((event: unknown) => void) | undefined, () => {
      close()
    }),
  })
}
