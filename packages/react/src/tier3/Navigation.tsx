import React, { createContext, useCallback, useContext, useRef } from 'react'
import {
  createNavigation,
  type Navigation as NavigationMachine,
  type NavigationItem,
} from '@web-loom/foolscap-core'
import { useMachine } from '../hooks/useMachine'
import { useCallbackRef } from '../utils/useCallbackRef'
import { cx } from '../utils/cx'

interface NavigationContextValue {
  machine: NavigationMachine
  items: NavigationItem[]
  injectRootEl: (el: HTMLElement | null) => void
  injectTriggerEl: (index: number, el: HTMLButtonElement | null) => void
  injectSubmenuLinkEl: (parentIndex: number, childIndex: number, el: HTMLAnchorElement | null) => void
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

function useNavigationContext(): NavigationContextValue {
  const ctx = useContext(NavigationContext)
  if (!ctx) throw new Error('Navigation components must be used inside NavigationRoot')
  return ctx
}

export type { NavigationItem }

export interface NavigationRootProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'aria-label' | 'onToggle'>,
    React.RefAttributes<HTMLElement> {
  items: NavigationItem[]
  label?: string
  orientation?: 'horizontal' | 'vertical'
  onToggle?: (detail: { index: number | null; isOpen: boolean }) => void
  onMobileToggle?: (detail: { isExpanded: boolean }) => void
  className?: string
  children?: React.ReactNode
}

export function NavigationRoot({
  items,
  label = 'Main navigation',
  orientation = 'horizontal',
  onToggle,
  onMobileToggle,
  className,
  children,
  ref,
  ...props
}: NavigationRootProps) {
  const itemsRef = useRef(items)
  itemsRef.current = items
  const labelRef = useRef(label)
  labelRef.current = label
  const orientationRef = useRef(orientation)
  orientationRef.current = orientation
  const stableOnToggle = useCallbackRef(onToggle)
  const stableOnMobileToggle = useCallbackRef(onMobileToggle)

  const machine = useMachine(() =>
    createNavigation({
      get items() {
        return itemsRef.current
      },
      get label() {
        return labelRef.current
      },
      get orientation() {
        return orientationRef.current
      },
      onToggle: stableOnToggle,
      onMobileToggle: stableOnMobileToggle,
    })
  )

  const injectRootEl = useCallback((el: HTMLElement | null) => machine.setRootEl(el), [machine])
  const injectTriggerEl = useCallback(
    (index: number, el: HTMLButtonElement | null) => machine.setTriggerEl(index, el),
    [machine]
  )
  const injectSubmenuLinkEl = useCallback(
    (parentIndex: number, childIndex: number, el: HTMLAnchorElement | null) =>
      machine.setSubmenuLinkEl(parentIndex, childIndex, el),
    [machine]
  )
  const rootProps = machine.getRootProps()

  return (
    <NavigationContext.Provider
      value={{ machine, items, injectRootEl, injectTriggerEl, injectSubmenuLinkEl }}
    >
      <nav
        {...props}
        aria-label={rootProps['aria-label']}
        data-state={rootProps['data-state']}
        data-orientation={rootProps['data-orientation']}
        ref={(el) => {
          injectRootEl(el)
          if (typeof ref === 'function') ref(el)
          else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = el
        }}
        className={cx('fc-navigation', className)}
      >
        {children ?? (
          <>
            <NavigationToggle />
            <NavigationList />
          </>
        )}
      </nav>
    </NavigationContext.Provider>
  )
}

export interface NavigationToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>,
    React.RefAttributes<HTMLButtonElement> {
  className?: string
}

export function NavigationToggle({ className, ref, children, onClick, onKeyDown, ...props }: NavigationToggleProps) {
  const { machine } = useNavigationContext()
  const toggleProps = machine.getToggleProps()

  return (
    <button
      type={toggleProps.type}
      {...props}
      aria-expanded={toggleProps['aria-expanded']}
      aria-controls={toggleProps['aria-controls']}
      aria-label={props['aria-label'] ?? toggleProps['aria-label']}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) toggleProps.onClick()
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (!e.defaultPrevented) toggleProps.onKeyDown(e.nativeEvent)
      }}
      ref={ref}
      className={cx('fc-navigation__toggle', className)}
    >
      {children ?? <span className="fc-navigation__icon" aria-hidden="true">☰</span>}
    </button>
  )
}

export interface NavigationListProps
  extends React.HTMLAttributes<HTMLUListElement>,
    React.RefAttributes<HTMLUListElement> {
  className?: string
}

export function NavigationList({ className, ref, ...props }: NavigationListProps) {
  const { machine, items, injectTriggerEl, injectSubmenuLinkEl } = useNavigationContext()
  const listProps = machine.getListProps()

  return (
    <ul
      {...props}
      id={listProps.id}
      hidden={listProps.hidden ? true : undefined}
      ref={ref}
      className={cx('fc-navigation__list', className)}
    >
      {items.map((item, index) => (
        <NavigationItemView
          key={`${item.label}-${item.href ?? index}`}
          item={item}
          index={index}
          machine={machine}
          injectTriggerEl={injectTriggerEl}
          injectSubmenuLinkEl={injectSubmenuLinkEl}
        />
      ))}
    </ul>
  )
}

interface NavigationItemViewProps {
  item: NavigationItem
  index: number
  machine: NavigationMachine
  injectTriggerEl: (index: number, el: HTMLButtonElement | null) => void
  injectSubmenuLinkEl: (parentIndex: number, childIndex: number, el: HTMLAnchorElement | null) => void
}

function NavigationItemView({
  item,
  index,
  machine,
  injectTriggerEl,
  injectSubmenuLinkEl,
}: NavigationItemViewProps) {
  const itemProps = machine.getItemProps(index)

  return (
    <li className="fc-navigation__item" data-state={itemProps['data-state']}>
      {item.children?.length ? (
        <>
          <NavigationTriggerView
            item={item}
            index={index}
            machine={machine}
            injectTriggerEl={injectTriggerEl}
          />
          <NavigationSubmenuView
            item={item}
            index={index}
            machine={machine}
            injectSubmenuLinkEl={injectSubmenuLinkEl}
          />
        </>
      ) : (
        <NavigationLinkView item={item} index={index} machine={machine} />
      )}
    </li>
  )
}

function NavigationLinkView({
  item,
  index,
  machine,
}: {
  item: NavigationItem
  index: number
  machine: NavigationMachine
}) {
  const linkProps = machine.getLinkProps(index)
  return (
    <a className="fc-navigation__link" href={linkProps.href} aria-current={linkProps['aria-current']}>
      {item.label}
    </a>
  )
}

function NavigationTriggerView({
  item,
  index,
  machine,
  injectTriggerEl,
}: {
  item: NavigationItem
  index: number
  machine: NavigationMachine
  injectTriggerEl: (index: number, el: HTMLButtonElement | null) => void
}) {
  const triggerProps = machine.getTriggerProps(index)
  return (
    <button
      type={triggerProps.type}
      aria-expanded={triggerProps['aria-expanded']}
      aria-controls={triggerProps['aria-controls']}
      onClick={triggerProps.onClick}
      onKeyDown={(e) => triggerProps.onKeyDown(e.nativeEvent)}
      ref={(el) => injectTriggerEl(index, el)}
      className="fc-navigation__trigger"
    >
      {item.label}
      <span className="fc-navigation__trigger-icon" aria-hidden="true">▾</span>
    </button>
  )
}

function NavigationSubmenuView({
  item,
  index,
  machine,
  injectSubmenuLinkEl,
}: {
  item: NavigationItem
  index: number
  machine: NavigationMachine
  injectSubmenuLinkEl: (parentIndex: number, childIndex: number, el: HTMLAnchorElement | null) => void
}) {
  const submenuProps = machine.getSubmenuProps(index)
  return (
    <ul
      id={submenuProps.id}
      hidden={submenuProps.hidden}
      onKeyDown={(e) => submenuProps.onKeyDown(e.nativeEvent)}
      className="fc-navigation__submenu"
    >
      {item.children?.map((child, childIndex) => {
        const linkProps = machine.getSubmenuLinkProps(index, childIndex)
        return (
          <li className="fc-navigation__submenu-item" key={`${child.label}-${child.href}`}>
            <a
              href={linkProps.href}
              aria-current={linkProps['aria-current']}
              onKeyDown={(e) => linkProps.onKeyDown(e.nativeEvent)}
              ref={(el) => injectSubmenuLinkEl(index, childIndex, el)}
              className="fc-navigation__submenu-link"
            >
              {child.label}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
