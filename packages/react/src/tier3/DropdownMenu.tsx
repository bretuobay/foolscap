import React, { createContext, useCallback, useContext, useRef } from 'react'
import {
  createDropdownMenu,
  type DropdownMenu as DropdownMenuMachine,
  type DropdownMenuItem,
} from '@web-loom/foolscap-core'
import { useMachine } from '../hooks/useMachine'
import { useCallbackRef } from '../utils/useCallbackRef'
import { cx } from '../utils/cx'

interface DropdownMenuContextValue {
  machine: DropdownMenuMachine
  items: DropdownMenuItem[]
  injectTriggerEl: (el: HTMLButtonElement | null) => void
  injectMenuEl: (el: HTMLUListElement | null) => void
  injectItemEl: (index: number, el: HTMLLIElement | null) => void
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null)

function useDropdownMenuContext(): DropdownMenuContextValue {
  const ctx = useContext(DropdownMenuContext)
  if (!ctx) {
    throw new Error('DropdownMenuTrigger and DropdownMenuContent must be used inside DropdownMenuRoot')
  }
  return ctx
}

export interface DropdownMenuRootProps {
  items: DropdownMenuItem[]
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  onSelect?: (item: DropdownMenuItem) => void
  onOpenChange?: (open: boolean) => void
  className?: string
  children: React.ReactNode
}

export function DropdownMenuRoot({
  items,
  placement,
  onSelect,
  onOpenChange,
  className,
  children,
}: DropdownMenuRootProps) {
  const itemsRef = useRef(items)
  itemsRef.current = items
  const placementRef = useRef(placement)
  placementRef.current = placement
  const stableOnSelect = useCallbackRef(onSelect)
  const stableOnOpenChange = useCallbackRef(onOpenChange)

  const machine = useMachine(() =>
    createDropdownMenu({
      get items() {
        return itemsRef.current
      },
      get placement() {
        return placementRef.current
      },
      onSelect: stableOnSelect,
      onOpenChange: stableOnOpenChange,
    })
  )

  const injectTriggerEl = useCallback(
    (el: HTMLButtonElement | null) => machine.setTriggerEl(el),
    [machine]
  )
  const injectMenuEl = useCallback((el: HTMLUListElement | null) => machine.setMenuEl(el), [machine])
  const injectItemEl = useCallback(
    (index: number, el: HTMLLIElement | null) => machine.setItemEl(index, el),
    [machine]
  )

  return (
    <DropdownMenuContext.Provider
      value={{ machine, items, injectTriggerEl, injectMenuEl, injectItemEl }}
    >
      <div
        className={cx('fc-dropdown-menu', className)}
        data-state={machine.state.isOpen ? 'open' : 'closed'}
      >
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export interface DropdownMenuTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>,
    React.RefAttributes<HTMLButtonElement> {
  className?: string
}

export function DropdownMenuTrigger({
  className,
  ref,
  children,
  onClick,
  onKeyDown,
  ...props
}: DropdownMenuTriggerProps) {
  const { machine, injectTriggerEl } = useDropdownMenuContext()
  const triggerProps = machine.getTriggerProps()

  return (
    <button
      type="button"
      {...props}
      aria-haspopup={triggerProps['aria-haspopup']}
      aria-expanded={triggerProps['aria-expanded']}
      aria-controls={triggerProps['aria-controls']}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) triggerProps.onClick()
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (!e.defaultPrevented) triggerProps.onKeyDown(e.nativeEvent)
      }}
      ref={(el) => {
        injectTriggerEl(el)
        if (typeof ref === 'function') ref(el)
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el
      }}
      className={cx('fc-dropdown-menu__trigger', className)}
    >
      {children}
    </button>
  )
}

export interface DropdownMenuContentProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, 'role'>,
    React.RefAttributes<HTMLUListElement> {
  renderItem?: (item: DropdownMenuItem) => React.ReactNode
  renderIcon?: (item: DropdownMenuItem) => React.ReactNode
  className?: string
}

export function DropdownMenuContent({
  className,
  ref,
  style,
  renderItem,
  renderIcon,
  ...props
}: DropdownMenuContentProps) {
  const { machine, items, injectMenuEl, injectItemEl } = useDropdownMenuContext()
  const menuProps = machine.getMenuProps()
  const { display: _display, ...safeStyle } = (style ?? {}) as React.CSSProperties & {
    display?: string
  }

  return (
    <ul
      {...props}
      id={menuProps.id}
      role={menuProps.role}
      hidden={menuProps.hidden}
      onKeyDown={(e) => menuProps.onKeyDown(e.nativeEvent)}
      ref={(el) => {
        injectMenuEl(el)
        if (typeof ref === 'function') ref(el)
        else if (ref) (ref as React.MutableRefObject<HTMLUListElement | null>).current = el
      }}
      style={safeStyle}
      className={cx('fc-dropdown-menu__menu', className)}
    >
      {items.map((item, index) =>
        item.separator ? (
          <DropdownMenuSeparator key={`${item.value}-${index}`} />
        ) : (
          <DropdownMenuItemView
            key={item.value}
            item={item}
            index={index}
            renderItem={renderItem}
            renderIcon={renderIcon}
            injectItemEl={injectItemEl}
            machine={machine}
          />
        )
      )}
    </ul>
  )
}

interface DropdownMenuItemViewProps {
  item: DropdownMenuItem
  index: number
  machine: DropdownMenuMachine
  injectItemEl: (index: number, el: HTMLLIElement | null) => void
  renderItem?: (item: DropdownMenuItem) => React.ReactNode
  renderIcon?: (item: DropdownMenuItem) => React.ReactNode
}

function DropdownMenuItemView({
  item,
  index,
  machine,
  injectItemEl,
  renderItem,
  renderIcon,
}: DropdownMenuItemViewProps) {
  const itemProps = machine.getItemProps(index)

  return (
    <li
      id={itemProps.id}
      role={itemProps.role}
      tabIndex={itemProps.tabIndex}
      aria-disabled={itemProps['aria-disabled']}
      data-state={itemProps['data-state']}
      data-value={item.value}
      onClick={itemProps.onClick}
      onMouseMove={itemProps.onMouseMove}
      ref={(el) => injectItemEl(index, el)}
      className="fc-dropdown-menu__item"
    >
      {renderIcon?.(item) ? (
        <span className="fc-dropdown-menu__item-icon" aria-hidden="true">
          {renderIcon(item)}
        </span>
      ) : null}
      <span className="fc-dropdown-menu__item-label">{renderItem?.(item) ?? item.label}</span>
    </li>
  )
}

export interface DropdownMenuSeparatorProps
  extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'role'> {
  className?: string
}

export function DropdownMenuSeparator({ className, ...props }: DropdownMenuSeparatorProps) {
  const { machine } = useDropdownMenuContext()
  const separatorProps = machine.getSeparatorProps()

  return (
    <li
      {...props}
      role={separatorProps.role}
      aria-orientation={separatorProps['aria-orientation']}
      className={cx('fc-dropdown-menu__separator', className)}
    />
  )
}
