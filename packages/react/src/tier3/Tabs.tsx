import React, { createContext, useContext } from 'react'
import { createTabs, type Tabs } from '@web-loom/foolscap-core'
import { useMachine } from '../hooks/useMachine'
import { useCallbackRef } from '../utils/useCallbackRef'
import { cx } from '../utils/cx'

interface TabsContextValue {
  machine: Tabs
  currentValue: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tab/TabsList/TabPanel must be used inside TabsRoot')
  return ctx
}

export interface TabsRootProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  activationMode?: 'automatic' | 'manual'
  orientation?: 'horizontal' | 'vertical'
  variant?: 'underline' | 'contained'
  loop?: boolean
  className?: string
  children: React.ReactNode
}

export function TabsRoot({
  defaultValue,
  value,
  onValueChange,
  activationMode,
  orientation,
  loop,
  variant,
  className,
  children,
}: TabsRootProps) {
  const stableOnChange = useCallbackRef(onValueChange)
  const machine = useMachine(() =>
    createTabs({ defaultValue, value, activationMode, orientation, loop, onValueChange: stableOnChange }),
  )

  // In controlled mode options.value in the machine is stale after re-renders.
  // Always derive currentValue from the React prop so context consumers are correct.
  const currentValue = value !== undefined ? value : machine.state.value

  return (
    <TabsContext.Provider value={{ machine, currentValue }}>
      <div className={cx('fc-tabs', className)} data-variant={variant} data-orientation={orientation ?? 'horizontal'}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

export function TabsList({ className, children, ...props }: TabsListProps) {
  const { machine } = useTabsContext()
  const tablistProps = machine.getTablistProps()
  return (
    <div
      {...tablistProps}
      {...props}
      className={cx('fc-tabs__tablist', className)}
    >
      {children}
    </div>
  )
}

export interface TabProps {
  value: string
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

export function Tab({ value, disabled, className, children }: TabProps) {
  const { machine, currentValue } = useTabsContext()
  const isSelected = currentValue === value
  // Spread machine props for id, aria-controls, onClick, onKeyDown
  // then override aria-selected and tabIndex using context-derived currentValue
  const { onClick, onKeyDown, id, 'aria-controls': ariaControls } = machine.getTabProps(value)

  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-controls={ariaControls}
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      data-state={isSelected ? 'active' : 'inactive'}
      disabled={disabled}
      className={cx('fc-tabs__tab', className)}
      onClick={onClick}
      onKeyDown={onKeyDown as unknown as React.KeyboardEventHandler<HTMLButtonElement>}
    >
      {children}
    </button>
  )
}

export interface TabPanelProps {
  value: string
  className?: string
  children: React.ReactNode
}

export function TabPanel({ value, className, children }: TabPanelProps) {
  const { machine, currentValue } = useTabsContext()
  const { id, 'aria-labelledby': labelledBy } = machine.getPanelProps(value)

  return (
    <div
      role="tabpanel"
      id={id}
      aria-labelledby={labelledBy}
      hidden={currentValue !== value}
      className={cx('fc-tabs__panel', className)}
    >
      {children}
    </div>
  )
}
