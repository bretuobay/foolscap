import { defineComponent, h, inject, provide, type InjectionKey, type PropType } from 'vue'
import {
  createPagination,
  type Pagination as PaginationMachine,
  type PaginationPage,
} from '@web-loom/foolscap-core'
import { useMachine } from '../composables/useMachine'
import { cx } from '../utils/cx'

export type { PaginationPage }

interface PaginationContextValue {
  machine: PaginationMachine
  getPageHref: { value?: (page: number) => string }
}

const PaginationKey: InjectionKey<PaginationContextValue> = Symbol('fc-pagination')

function usePaginationContext(): PaginationContextValue {
  const ctx = inject(PaginationKey, null)
  if (!ctx) throw new Error('Pagination components must be used inside PaginationRoot')
  return ctx
}

export interface PaginationRootProps {
  totalPages: number
  page?: number
  defaultPage?: number
  siblingCount?: number
  getPageHref?: (page: number) => string
  size?: 'sm' | 'md' | 'lg'
}

export interface PaginationPageLinkProps {
  page: number
}

export const PaginationRoot = defineComponent({
  name: 'FcPaginationRoot',
  inheritAttrs: false,
  props: {
    totalPages: { type: Number, required: true },
    page: { type: Number, default: undefined },
    defaultPage: { type: Number, default: undefined },
    siblingCount: { type: Number, default: undefined },
    getPageHref: { type: Function as PropType<(page: number) => string>, default: undefined },
    size: { type: String as PropType<PaginationRootProps['size']>, default: undefined },
  },
  emits: ['pageChange', 'update:page'],
  setup(props, { slots, attrs, emit }) {
    const defaultPage = props.defaultPage
    const machine = useMachine(() =>
      createPagination({
        get totalPages() {
          return props.totalPages
        },
        get page() {
          return props.page
        },
        defaultPage,
        get siblingCount() {
          return props.siblingCount
        },
        onPageChange: (page, prevPage) => {
          emit('update:page', page)
          emit('pageChange', page, prevPage)
        },
      }),
    )

    provide(PaginationKey, {
      machine,
      getPageHref: {
        get value() {
          return props.getPageHref
        },
      },
    })

    return () => {
      const rootProps = machine.getRootProps()
      const { class: className, 'aria-label': ariaLabel, ...rest } = attrs

      return h(
        'nav',
        {
          ...rest,
          ref: (el: unknown) => machine.setRootEl(el instanceof HTMLElement ? el : null),
          'aria-label': (ariaLabel as string | undefined) ?? rootProps['aria-label'],
          'data-size': props.size,
          class: cx('fc-pagination', className as string | undefined),
        },
        slots.default?.() ?? [h(PaginationList)],
      )
    }
  },
})

export const PaginationList = defineComponent({
  name: 'FcPaginationList',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const { machine } = usePaginationContext()

    return () => {
      void machine.state
      const state = machine.state
      return h(
        'ol',
        {
          ...attrs,
          class: cx('fc-pagination__list', attrs.class as string | undefined),
        },
        [
          h('li', { class: 'fc-pagination__item' }, [h(PaginationPrev)]),
          ...state.pages.map((page, index) =>
            h(
              'li',
              { class: 'fc-pagination__item', key: `${page}-${index}` },
              [page === 'ellipsis' ? h(PaginationEllipsis) : h(PaginationPageLink, { page })],
            ),
          ),
          h('li', { class: 'fc-pagination__item' }, [h(PaginationNext)]),
        ],
      )
    }
  },
})

export const PaginationPrev = defineComponent({
  name: 'FcPaginationPrev',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const { machine } = usePaginationContext()

    return () => {
      void machine.state
      const prevProps = machine.getPrevProps()
      const { class: className, onClick, 'aria-label': ariaLabel, ...rest } = attrs

      return h(
        'button',
        {
          ...rest,
          type: prevProps.type,
          'aria-label': (ariaLabel as string | undefined) ?? prevProps['aria-label'],
          'aria-disabled': prevProps['aria-disabled'],
          'data-state': prevProps['data-state'],
          disabled: prevProps.disabled,
          onClick: (event: Event) => {
            if (typeof onClick === 'function') onClick(event)
            if (!event.defaultPrevented) prevProps.onClick()
          },
          class: cx('fc-pagination__prev', className as string | undefined),
        },
        slots.default?.() ?? '‹ Prev',
      )
    }
  },
})

export const PaginationNext = defineComponent({
  name: 'FcPaginationNext',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const { machine } = usePaginationContext()

    return () => {
      void machine.state
      const nextProps = machine.getNextProps()
      const { class: className, onClick, 'aria-label': ariaLabel, ...rest } = attrs

      return h(
        'button',
        {
          ...rest,
          type: nextProps.type,
          'aria-label': (ariaLabel as string | undefined) ?? nextProps['aria-label'],
          'aria-disabled': nextProps['aria-disabled'],
          'data-state': nextProps['data-state'],
          disabled: nextProps.disabled,
          onClick: (event: Event) => {
            if (typeof onClick === 'function') onClick(event)
            if (!event.defaultPrevented) nextProps.onClick()
          },
          class: cx('fc-pagination__next', className as string | undefined),
        },
        slots.default?.() ?? 'Next ›',
      )
    }
  },
})

export const PaginationPageLink = defineComponent({
  name: 'FcPaginationPageLink',
  inheritAttrs: false,
  props: {
    page: { type: Number, required: true },
  },
  setup(props, { slots, attrs }) {
    const { machine, getPageHref } = usePaginationContext()

    return () => {
      void machine.state
      const linkProps = machine.getLinkProps(props.page)
      const href = getPageHref.value?.(props.page)
      const content = slots.default?.() ?? props.page

      if (href) {
        return h(
          'a',
          {
            href,
            'aria-label': linkProps['aria-label'],
            'aria-current': linkProps['aria-current'],
            onClick: (event: Event) => {
              if (!event.defaultPrevented) linkProps.onClick()
            },
            class: cx('fc-pagination__link', attrs.class as string | undefined),
          },
          content,
        )
      }

      return h(
        'button',
        {
          type: linkProps.type,
          'aria-label': linkProps['aria-label'],
          'aria-current': linkProps['aria-current'],
          onClick: linkProps.onClick,
          class: cx('fc-pagination__link', attrs.class as string | undefined),
        },
        content,
      )
    }
  },
})

export const PaginationEllipsis = defineComponent({
  name: 'FcPaginationEllipsis',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'span',
        {
          ...attrs,
          'aria-hidden': 'true',
          class: cx('fc-pagination__ellipsis', attrs.class as string | undefined),
        },
        slots.default?.() ?? '…',
      )
  },
})
