import {
  cloneVNode,
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  provide,
  ref,
  shallowRef,
  Teleport,
  triggerRef,
  watch,
  type ComponentPublicInstance,
  type InjectionKey,
  type PropType,
  type VNode,
} from 'vue'
import { createTooltip, type Tooltip as TooltipMachine } from '@web-loom/foolscap-core'
import { cx } from '../utils/cx'

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

interface TooltipContextValue {
  machine: { value: TooltipMachine | null }
  setTriggerEl: (el: HTMLElement | null) => void
  setContentEl: (el: HTMLElement | null) => void
}

const TooltipKey: InjectionKey<TooltipContextValue> = Symbol('fc-tooltip')

function asHtmlElement(el: unknown): HTMLElement | null {
  if (el instanceof HTMLElement) return el
  if (el && typeof el === 'object' && '$el' in el) {
    const root = (el as ComponentPublicInstance).$el
    return root instanceof HTMLElement ? root : null
  }
  return null
}

function mergeDescribedBy(existing: string | undefined, next: string | undefined): string | undefined {
  const ids = [existing, next]
    .filter(Boolean)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean)
  return [...new Set(ids)].join(' ') || undefined
}

function useTooltipContext(): TooltipContextValue {
  const ctx = inject(TooltipKey, null)
  if (!ctx) throw new Error('TooltipTrigger and TooltipContent must be used inside TooltipRoot')
  return ctx
}

export interface TooltipRootProps {
  openDelay?: number
  closeDelay?: number
  placement?: TooltipPlacement
  offset?: number
}

export const TooltipRoot = defineComponent({
  name: 'FcTooltipRoot',
  inheritAttrs: false,
  props: {
    openDelay: { type: Number, default: 300 },
    closeDelay: { type: Number, default: 100 },
    placement: { type: String as PropType<TooltipPlacement>, default: 'top' },
    offset: { type: Number, default: 8 },
  },
  setup(props, { slots, attrs }) {
    const triggerEl = ref<HTMLElement | null>(null)
    const contentEl = ref<HTMLElement | null>(null)
    const machine = shallowRef<TooltipMachine | null>(null)
    let unsubscribe: (() => void) | undefined

    function teardown() {
      unsubscribe?.()
      unsubscribe = undefined
      machine.value?.destroy()
      machine.value = null
    }

    watch(
      () =>
        [triggerEl.value, contentEl.value, props.openDelay, props.closeDelay, props.placement, props.offset] as const,
      ([trigger, content]) => {
        teardown()
        if (!trigger || !content) return

        const instance = createTooltip(trigger, content, {
          openDelay: props.openDelay,
          closeDelay: props.closeDelay,
          placement: props.placement,
          offset: props.offset,
        })
        machine.value = instance
        unsubscribe = instance.subscribe(() => triggerRef(machine))
      },
      { flush: 'post' },
    )

    onBeforeUnmount(teardown)

    provide(TooltipKey, {
      machine,
      setTriggerEl: (el) => {
        if (triggerEl.value !== el) triggerEl.value = el
      },
      setContentEl: (el) => {
        if (contentEl.value !== el) contentEl.value = el
      },
    })

    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-state': machine.value?.state.open ? 'open' : 'closed',
          class: cx('fc-tooltip', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const TooltipTrigger = defineComponent({
  name: 'FcTooltipTrigger',
  inheritAttrs: false,
  setup(_, { slots }) {
    const ctx = useTooltipContext()
    const setTriggerEl = (el: unknown) => {
      ctx.setTriggerEl(asHtmlElement(el))
    }

    return () => {
      const children = slots.default?.()
      const vnode = children?.[0] as VNode | undefined
      if (!vnode) return null

      const triggerProps = ctx.machine.value?.getTriggerProps()
      const childProps = (vnode.props ?? {}) as Record<string, unknown>

      function handleMouseEnter(event: Event) {
        const existing = childProps.onMouseEnter ?? childProps.onMouseenter
        if (typeof existing === 'function') existing(event)
        ctx.machine.value?.getTriggerProps().onMouseEnter()
      }

      function handleMouseLeave(event: Event) {
        const existing = childProps.onMouseLeave ?? childProps.onMouseleave
        if (typeof existing === 'function') existing(event)
        ctx.machine.value?.getTriggerProps().onMouseLeave()
      }

      return cloneVNode(
        vnode,
        {
          ...triggerProps,
          'aria-describedby': mergeDescribedBy(
            childProps['aria-describedby'] as string | undefined,
            triggerProps?.['aria-describedby'],
          ),
          onMouseEnter: handleMouseEnter,
          onMouseenter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
          onMouseleave: handleMouseLeave,
          onFocus: (event: Event) => {
            const existing = childProps.onFocus
            if (typeof existing === 'function') existing(event)
            ctx.machine.value?.getTriggerProps().onFocus()
          },
          onBlur: (event: Event) => {
            const existing = childProps.onBlur
            if (typeof existing === 'function') existing(event)
            ctx.machine.value?.getTriggerProps().onBlur()
          },
          ref: setTriggerEl,
        },
        true,
      )
    }
  },
})

export const TooltipContent = defineComponent({
  name: 'FcTooltipContent',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const ctx = useTooltipContext()
    const setContentEl = (el: unknown) => {
      ctx.setContentEl(asHtmlElement(el))
    }

    return () => {
      const contentProps = ctx.machine.value?.getContentProps()
      const { class: className, ...rest } = attrs
      const content = h(
        'div',
        {
          ...rest,
          ...contentProps,
          ref: setContentEl,
          'data-state': contentProps?.['data-state'] ?? 'closed',
          hidden: contentProps?.hidden ?? true,
          class: cx('fc-tooltip__content', className as string | undefined),
        },
        slots.default?.(),
      )

      if (typeof document === 'undefined') return content
      return h(Teleport, { to: 'body' }, [content])
    }
  },
})
