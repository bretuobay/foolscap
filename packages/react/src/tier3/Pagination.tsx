import React, { createContext, useCallback, useContext, useRef } from 'react'
import {
  createPagination,
  type Pagination as PaginationMachine,
  type PaginationPage,
} from '@web-loom/foolscap-core'
import { useMachine } from '../hooks/useMachine'
import { useCallbackRef } from '../utils/useCallbackRef'
import { cx } from '../utils/cx'

interface PaginationContextValue {
  machine: PaginationMachine
  injectRootEl: (el: HTMLElement | null) => void
  getPageHref?: (page: number) => string
}

const PaginationContext = createContext<PaginationContextValue | null>(null)

function usePaginationContext(): PaginationContextValue {
  const ctx = useContext(PaginationContext)
  if (!ctx) throw new Error('Pagination components must be used inside PaginationRoot')
  return ctx
}

export interface PaginationRootProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children'>,
    React.RefAttributes<HTMLElement> {
  totalPages: number
  page?: number
  defaultPage?: number
  siblingCount?: number
  onPageChange?: (page: number, prevPage: number) => void
  getPageHref?: (page: number) => string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
}

export function PaginationRoot({
  totalPages,
  page,
  defaultPage,
  siblingCount,
  onPageChange,
  getPageHref,
  size,
  className,
  children,
  ref,
  ...props
}: PaginationRootProps) {
  const totalPagesRef = useRef(totalPages)
  totalPagesRef.current = totalPages
  const pageRef = useRef(page)
  pageRef.current = page
  const siblingCountRef = useRef(siblingCount)
  siblingCountRef.current = siblingCount
  const defaultPageRef = useRef(defaultPage)
  const stableOnPageChange = useCallbackRef(onPageChange)

  const machine = useMachine(() =>
    createPagination({
      get totalPages() {
        return totalPagesRef.current
      },
      get page() {
        return pageRef.current
      },
      defaultPage: defaultPageRef.current,
      get siblingCount() {
        return siblingCountRef.current
      },
      onPageChange: stableOnPageChange,
    })
  )

  const injectRootEl = useCallback((el: HTMLElement | null) => machine.setRootEl(el), [machine])
  const rootProps = machine.getRootProps()

  return (
    <PaginationContext.Provider value={{ machine, injectRootEl, getPageHref }}>
      <nav
        {...props}
        aria-label={props['aria-label'] ?? rootProps['aria-label']}
        data-size={size}
        ref={(el) => {
          injectRootEl(el)
          if (typeof ref === 'function') ref(el)
          else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = el
        }}
        className={cx('fc-pagination', className)}
      >
        {children ?? <PaginationList />}
      </nav>
    </PaginationContext.Provider>
  )
}

export interface PaginationListProps
  extends React.OlHTMLAttributes<HTMLOListElement>,
    React.RefAttributes<HTMLOListElement> {
  className?: string
}

export function PaginationList({ className, ref, ...props }: PaginationListProps) {
  const { machine } = usePaginationContext()
  const state = machine.state

  return (
    <ol {...props} ref={ref} className={cx('fc-pagination__list', className)}>
      <li className="fc-pagination__item">
        <PaginationPrev />
      </li>
      {state.pages.map((page, index) => (
        <li className="fc-pagination__item" key={`${page}-${index}`}>
          {page === 'ellipsis' ? <PaginationEllipsis /> : <PaginationPageLink page={page} />}
        </li>
      ))}
      <li className="fc-pagination__item">
        <PaginationNext />
      </li>
    </ol>
  )
}

export interface PaginationPrevProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  className?: string
}

export function PaginationPrev({ className, children = '‹ Prev', onClick, ...props }: PaginationPrevProps) {
  const { machine } = usePaginationContext()
  const prevProps = machine.getPrevProps()

  return (
    <button
      type={prevProps.type}
      {...props}
      aria-label={props['aria-label'] ?? prevProps['aria-label']}
      aria-disabled={prevProps['aria-disabled']}
      data-state={prevProps['data-state']}
      disabled={prevProps.disabled}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) prevProps.onClick()
      }}
      className={cx('fc-pagination__prev', className)}
    >
      {children}
    </button>
  )
}

export interface PaginationNextProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  className?: string
}

export function PaginationNext({ className, children = 'Next ›', onClick, ...props }: PaginationNextProps) {
  const { machine } = usePaginationContext()
  const nextProps = machine.getNextProps()

  return (
    <button
      type={nextProps.type}
      {...props}
      aria-label={props['aria-label'] ?? nextProps['aria-label']}
      aria-disabled={nextProps['aria-disabled']}
      data-state={nextProps['data-state']}
      disabled={nextProps.disabled}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) nextProps.onClick()
      }}
      className={cx('fc-pagination__next', className)}
    >
      {children}
    </button>
  )
}

export interface PaginationPageLinkProps {
  page: number
  className?: string
  children?: React.ReactNode
}

export function PaginationPageLink({ page, className, children }: PaginationPageLinkProps) {
  const { machine, getPageHref } = usePaginationContext()
  const linkProps = machine.getLinkProps(page)
  const href = getPageHref?.(page)
  const content = children ?? page

  if (href) {
    return (
      <a
        href={href}
        aria-label={linkProps['aria-label']}
        aria-current={linkProps['aria-current']}
        onClick={(e) => {
          if (!e.defaultPrevented) linkProps.onClick()
        }}
        className={cx('fc-pagination__link', className)}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type={linkProps.type}
      aria-label={linkProps['aria-label']}
      aria-current={linkProps['aria-current']}
      onClick={linkProps.onClick}
      className={cx('fc-pagination__link', className)}
    >
      {content}
    </button>
  )
}

export interface PaginationEllipsisProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string
}

export function PaginationEllipsis({ className, children = '…', ...props }: PaginationEllipsisProps) {
  return (
    <span {...props} aria-hidden="true" className={cx('fc-pagination__ellipsis', className)}>
      {children}
    </span>
  )
}

export type { PaginationPage }
