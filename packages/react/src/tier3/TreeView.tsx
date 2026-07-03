import React, { createContext, useCallback, useContext, useRef } from 'react'
import {
  createTreeView,
  type TreeView as TreeViewMachine,
  type TreeViewItem,
  type TreeViewSelectionMode,
} from '@web-loom/foolscap-core'
import { useMachine } from '../hooks/useMachine'
import { useCallbackRef } from '../utils/useCallbackRef'
import { cx } from '../utils/cx'

interface TreeViewContextValue {
  machine: TreeViewMachine
  items: TreeViewItem[]
  injectRootEl: (el: HTMLUListElement | null) => void
  injectItemEl: (id: string, el: HTMLLIElement | null) => void
}

const TreeViewContext = createContext<TreeViewContextValue | null>(null)

function useTreeViewContext(): TreeViewContextValue {
  const ctx = useContext(TreeViewContext)
  if (!ctx) throw new Error('TreeView components must be used inside TreeViewRoot')
  return ctx
}

export type { TreeViewItem, TreeViewSelectionMode }

export interface TreeViewRootProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, 'children' | 'onSelect'>,
    React.RefAttributes<HTMLUListElement> {
  items: TreeViewItem[]
  expandedIds?: string[]
  defaultExpandedIds?: string[]
  selectedId?: string | null
  defaultSelectedId?: string | null
  selectionMode?: TreeViewSelectionMode
  label?: string
  onExpandedChange?: (ids: string[]) => void
  onSelectionChange?: (id: string) => void
  className?: string
  children?: React.ReactNode
}

export function TreeViewRoot({
  items,
  expandedIds,
  defaultExpandedIds,
  selectedId,
  defaultSelectedId,
  selectionMode = 'single',
  label = 'Tree',
  onExpandedChange,
  onSelectionChange,
  className,
  children,
  ref,
  ...props
}: TreeViewRootProps) {
  const itemsRef = useRef(items)
  itemsRef.current = items
  const expandedIdsRef = useRef(expandedIds)
  expandedIdsRef.current = expandedIds
  const defaultExpandedIdsRef = useRef(defaultExpandedIds)
  const selectedIdRef = useRef(selectedId)
  selectedIdRef.current = selectedId
  const defaultSelectedIdRef = useRef(defaultSelectedId)
  const selectionModeRef = useRef(selectionMode)
  selectionModeRef.current = selectionMode
  const labelRef = useRef(label)
  labelRef.current = label
  const stableOnExpandedChange = useCallbackRef(onExpandedChange)
  const stableOnSelectionChange = useCallbackRef(onSelectionChange)

  const machine = useMachine(() =>
    createTreeView({
      get items() {
        return itemsRef.current
      },
      get expandedIds() {
        return expandedIdsRef.current
      },
      defaultExpandedIds: defaultExpandedIdsRef.current,
      get selectedId() {
        return selectedIdRef.current
      },
      defaultSelectedId: defaultSelectedIdRef.current,
      get selectionMode() {
        return selectionModeRef.current
      },
      get label() {
        return labelRef.current
      },
      onExpandedChange: stableOnExpandedChange,
      onSelectionChange: stableOnSelectionChange,
    })
  )

  const injectRootEl = useCallback((el: HTMLUListElement | null) => machine.setRootEl(el), [machine])
  const injectItemEl = useCallback((id: string, el: HTMLLIElement | null) => machine.setItemEl(id, el), [machine])
  const rootProps = machine.getRootProps()

  return (
    <TreeViewContext.Provider value={{ machine, items, injectRootEl, injectItemEl }}>
      <ul
        {...props}
        role={rootProps.role}
        aria-label={props['aria-label'] ?? rootProps['aria-label']}
        ref={(el) => {
          injectRootEl(el)
          if (typeof ref === 'function') ref(el)
          else if (ref) (ref as React.MutableRefObject<HTMLUListElement | null>).current = el
        }}
        className={cx('fc-tree', className)}
      >
        {children ?? items.map((item) => <TreeViewItemView key={item.id} item={item} />)}
      </ul>
    </TreeViewContext.Provider>
  )
}

export interface TreeViewItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  item: TreeViewItem
  className?: string
}

export function TreeViewItemView({ item, className, children, ...props }: TreeViewItemProps) {
  const { machine, injectItemEl } = useTreeViewContext()
  const hasChildren = Boolean(item.children?.length)
  const itemProps = machine.getItemProps(item.id, hasChildren)

  return (
    <li
      {...props}
      role={itemProps.role}
      id={props.id ?? itemProps.id}
      aria-label={props['aria-label'] ?? itemProps['aria-label']}
      tabIndex={itemProps.tabIndex}
      aria-expanded={itemProps['aria-expanded']}
      aria-selected={itemProps['aria-selected']}
      aria-disabled={itemProps['aria-disabled']}
      aria-level={itemProps['aria-level']}
      data-state={itemProps['data-state']}
      data-disabled={itemProps['data-disabled']}
      onClick={(e) => {
        props.onClick?.(e)
        if (!e.defaultPrevented) {
          e.stopPropagation()
          itemProps.onClick()
        }
      }}
      onKeyDown={(e) => {
        props.onKeyDown?.(e)
        if (!e.defaultPrevented) {
          e.stopPropagation()
          itemProps.onKeyDown(e.nativeEvent)
        }
      }}
      ref={(el) => injectItemEl(item.id, el)}
      className={cx('fc-tree__item', className)}
    >
      {children ?? (
        <>
          <TreeViewItemContent item={item} />
          {hasChildren ? <TreeViewGroup parent={item} /> : null}
        </>
      )}
    </li>
  )
}

export interface TreeViewItemContentProps extends React.HTMLAttributes<HTMLDivElement> {
  item: TreeViewItem
  className?: string
}

export function TreeViewItemContent({ item, className, children, ...props }: TreeViewItemContentProps) {
  const hasChildren = Boolean(item.children?.length)
  return (
    <div {...props} className={cx('fc-tree__item-content', className)}>
      {hasChildren ? <TreeViewToggle item={item} /> : <span className="fc-tree__spacer" aria-hidden="true" />}
      <TreeViewLabel>{children ?? item.label}</TreeViewLabel>
    </div>
  )
}

export interface TreeViewToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  item: TreeViewItem
  className?: string
}

export function TreeViewToggle({ item, className, children, ...props }: TreeViewToggleProps) {
  const { machine } = useTreeViewContext()
  const toggleProps = machine.getToggleProps(item.id)
  const expanded = machine.getItemProps(item.id, true)['aria-expanded']

  return (
    <button
      {...props}
      type={toggleProps.type}
      tabIndex={toggleProps.tabIndex}
      aria-label={props['aria-label'] ?? toggleProps['aria-label']}
      onClick={(e) => {
        e.stopPropagation()
        props.onClick?.(e)
        if (!e.defaultPrevented) toggleProps.onClick()
      }}
      className={cx('fc-tree__toggle', className)}
    >
      {children ?? <span aria-hidden="true">{expanded ? '▾' : '▸'}</span>}
    </button>
  )
}

export interface TreeViewLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string
}

export function TreeViewLabel({ className, ...props }: TreeViewLabelProps) {
  return <span {...props} className={cx('fc-tree__label', className)} />
}

export interface TreeViewGroupProps extends React.HTMLAttributes<HTMLUListElement> {
  parent: TreeViewItem
  className?: string
}

export function TreeViewGroup({ parent, className, ...props }: TreeViewGroupProps) {
  const { machine } = useTreeViewContext()
  const groupProps = machine.getGroupProps(parent.id)
  return (
    <ul
      {...props}
      role={groupProps.role}
      hidden={groupProps.hidden ? true : undefined}
      className={cx('fc-tree__group', className)}
    >
      {(parent.children ?? []).map((child) => (
        <TreeViewItemView key={child.id} item={child} />
      ))}
    </ul>
  )
}
