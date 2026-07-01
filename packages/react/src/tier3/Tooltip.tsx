import React, {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { createTooltip, type Tooltip as TooltipMachine } from '@web-loom/foolscap-core'
import { cx } from '../utils/cx'

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

interface TooltipContextValue {
  machine: TooltipMachine | null
  setTriggerEl: (el: HTMLElement | null) => void
  setContentEl: (el: HTMLElement | null) => void
}

const TooltipContext = createContext<TooltipContextValue | null>(null)

function useTooltipContext(): TooltipContextValue {
  const ctx = useContext(TooltipContext)
  if (!ctx) throw new Error('TooltipTrigger and TooltipContent must be used inside TooltipRoot')
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

function mergeDescribedBy(existing: string | undefined, next: string | undefined): string | undefined {
  const ids = [existing, next]
    .filter(Boolean)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean)
  return [...new Set(ids)].join(' ') || undefined
}

function getElementRef<T>(element: React.ReactElement<T>): React.Ref<unknown> | undefined {
  const typedElement = element as React.ReactElement<T> & {
    ref?: React.Ref<unknown>
    props: T & { ref?: React.Ref<unknown> }
  }
  return typedElement.ref ?? typedElement.props.ref
}

export interface TooltipRootProps extends React.HTMLAttributes<HTMLDivElement> {
  openDelay?: number
  closeDelay?: number
  placement?: TooltipPlacement
  offset?: number
  className?: string
  children: React.ReactNode
}

export function TooltipRoot({
  openDelay = 300,
  closeDelay = 100,
  placement = 'top',
  offset = 8,
  className,
  children,
  ...props
}: TooltipRootProps) {
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null)
  const [contentEl, setContentEl] = useState<HTMLElement | null>(null)
  const machineRef = useRef<TooltipMachine | null>(null)
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)

  useEffect(() => {
    if (!triggerEl || !contentEl) return

    const machine = createTooltip(triggerEl, contentEl, {
      openDelay,
      closeDelay,
      placement,
      offset,
    })

    machineRef.current = machine
    const unsubscribe = machine.subscribe(() => forceUpdate())
    forceUpdate()

    return () => {
      unsubscribe()
      machine.destroy()
      machineRef.current = null
    }
  }, [triggerEl, contentEl, openDelay, closeDelay, placement, offset])

  const machine = machineRef.current

  return (
    <TooltipContext.Provider value={{ machine, setTriggerEl, setContentEl }}>
      <div {...props} data-state={machine?.state.open ? 'open' : 'closed'} className={cx('fc-tooltip', className)}>
        {children}
      </div>
    </TooltipContext.Provider>
  )
}

export interface TooltipTriggerProps {
  asChild?: boolean
  children: React.ReactElement
}

export function TooltipTrigger({ asChild = true, children }: TooltipTriggerProps) {
  const { machine, setTriggerEl } = useTooltipContext()
  void asChild

  const triggerProps = machine?.getTriggerProps()
  const childProps = children.props as Record<string, unknown>
  const mergedProps = {
    ...triggerProps,
    'aria-describedby': mergeDescribedBy(
      childProps['aria-describedby'] as string | undefined,
      triggerProps?.['aria-describedby']
    ),
    onMouseEnter: mergeHandlers(
      childProps.onMouseEnter as ((event: unknown) => void) | undefined,
      triggerProps?.onMouseEnter
    ),
    onMouseLeave: mergeHandlers(
      childProps.onMouseLeave as ((event: unknown) => void) | undefined,
      triggerProps?.onMouseLeave
    ),
    onFocus: mergeHandlers(childProps.onFocus as ((event: unknown) => void) | undefined, triggerProps?.onFocus),
    onBlur: mergeHandlers(childProps.onBlur as ((event: unknown) => void) | undefined, triggerProps?.onBlur),
    ref: mergeRefs(getElementRef(children), setTriggerEl),
  }

  return cloneElement(children, mergedProps)
}

export interface TooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    React.RefAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

export function TooltipContent({ className, children, ref, ...props }: TooltipContentProps) {
  const { machine, setContentEl } = useTooltipContext()
  const contentProps = machine?.getContentProps()

  const content = (
    <div
      {...props}
      {...contentProps}
      ref={mergeRefs(ref, setContentEl)}
      data-state={contentProps?.['data-state'] ?? 'closed'}
      hidden={contentProps?.hidden ?? true}
      className={cx('fc-tooltip__content', className)}
    >
      {children}
    </div>
  )

  return typeof document === 'undefined' ? content : createPortal(content, document.body)
}
