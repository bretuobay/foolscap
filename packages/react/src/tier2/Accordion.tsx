import React, { createContext, useContext, useEffect, useRef } from 'react'
import { createAccordion, type Accordion } from '@web-loom/foolscap-core'
import { useMachine } from '../hooks/useMachine'
import { useCallbackRef } from '../utils/useCallbackRef'
import { cx } from '../utils/cx'

interface AccordionContextValue {
  machine: Accordion
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

function useAccordionContext(): AccordionContextValue {
  const ctx = useContext(AccordionContext)
  if (!ctx) throw new Error('AccordionItem must be used inside AccordionRoot')
  return ctx
}

export interface AccordionRootProps {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  onValueChange?: (v: string | string[]) => void
  className?: string
  children: React.ReactNode
}

export function AccordionRoot({
  type = 'single',
  defaultValue,
  onValueChange,
  className,
  children,
}: AccordionRootProps) {
  const stableOnChange = useCallbackRef(onValueChange)
  const machine = useMachine(() =>
    createAccordion({ type, defaultValue, onValueChange: stableOnChange }),
  )

  return (
    <AccordionContext.Provider value={{ machine }}>
      <div className={cx('fc-accordion', className)} data-type={type}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

export interface AccordionItemProps {
  value: string
  className?: string
  children: React.ReactNode
}

export function AccordionItem({ value, className, children }: AccordionItemProps) {
  const { machine } = useAccordionContext()
  const ref = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    return machine.register({ value, detailsEl: el })
  }, [machine, value])

  const { value: stateValue } = machine.state
  const isOpen = Array.isArray(stateValue)
    ? stateValue.includes(value)
    : stateValue === value

  return (
    <details
      ref={ref}
      className={cx('fc-accordion__item', className)}
      data-state={isOpen ? 'open' : 'closed'}
    >
      {children}
    </details>
  )
}

export interface AccordionTriggerProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
  children: React.ReactNode
}

export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  return (
    <summary className={cx('fc-accordion__trigger', className)} {...props}>
      {children}
    </summary>
  )
}

export interface AccordionPanelProps {
  className?: string
  children: React.ReactNode
}

export function AccordionPanel({ className, children }: AccordionPanelProps) {
  return <div className={cx('fc-accordion__panel', className)}>{children}</div>
}
