import {
  cloneVNode,
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  provide,
  ref,
  shallowRef,
  triggerRef,
  watch,
  type ComponentPublicInstance,
  type InjectionKey,
  type PropType,
  type VNode,
} from 'vue'
import { createPopover, type Popover as PopoverMachine } from '@web-loom/foolscap-core'
import { cx } from '../utils/cx'

type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right'

interface PopoverContextValue {
  machine: { value: PopoverMachine | null }
  placement: { value: PopoverPlacement }
  setTriggerEl: (el: HTMLElement | null) => void
  setContentEl: (el: HTMLElement | null) => void
  close: () => void
}

const PopoverKey: InjectionKey<PopoverContextValue> = Symbol('fc-popover')

function asHtmlElement(el: unknown): HTMLElement | null {
  if (el instanceof HTMLElement) return el
  if (el && typeof el === 'object' && '$el' in el) {
    const root = (el as ComponentPublicInstance).$el
    return root instanceof HTMLElement ? root : null
  }
  return null
}

function usePopoverContext(): PopoverContextValue {
  const ctx = inject(PopoverKey, null)
  if (!ctx) throw new Error('PopoverTrigger and PopoverContent must be used inside PopoverRoot')
  return ctx
}

export interface PopoverRootProps {
  open?: boolean
  defaultOpen?: boolean
  placement?: PopoverPlacement
  offset?: number
}

export const PopoverRoot = defineComponent({
  name: 'FcPopoverRoot',
  inheritAttrs: false,
  props: {
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    placement: { type: String as PropType<PopoverPlacement>, default: 'bottom' },
    offset: { type: Number, default: 8 },
  },
  emits: ['openChange'],
  setup(props, { slots, emit }) {
    const triggerEl = ref<HTMLElement | null>(null)
    const contentEl = ref<HTMLElement | null>(null)
    const machine = shallowRef<PopoverMachine | null>(null)
    let unsubscribe: (() => void) | undefined
    let didApplyDefaultOpen = false

    function teardown() {
      unsubscribe?.()
      unsubscribe = undefined
      machine.value?.destroy()
      machine.value = null
    }

    watch(
      () => [triggerEl.value, contentEl.value, props.placement, props.offset] as const,
      ([trigger, content]) => {
        teardown()
        if (!trigger || !content) return

        const instance = createPopover(trigger, content, {
          placement: props.placement,
          offset: props.offset,
          onOpen: () => emit('openChange', true),
          onClose: () => emit('openChange', false),
        })
        machine.value = instance
        unsubscribe = instance.subscribe(() => triggerRef(machine))

        if (props.open !== undefined) {
          if (props.open && !instance.state.open) void instance.open()
          else if (!props.open && instance.state.open) instance.close()
        } else if (props.defaultOpen && !didApplyDefaultOpen) {
          didApplyDefaultOpen = true
          void instance.open()
        }
      },
      { flush: 'post' },
    )

    watch(
      () => props.open,
      (open) => {
        const instance = machine.value
        if (!instance || open === undefined) return
        if (open && !instance.state.open) void instance.open()
        else if (!open && instance.state.open) instance.close()
      },
    )

    onBeforeUnmount(teardown)

    provide(PopoverKey, {
      machine,
      placement: { get value() { return props.placement } },
      setTriggerEl: (el) => {
        if (triggerEl.value !== el) triggerEl.value = el
      },
      setContentEl: (el) => {
        if (contentEl.value !== el) contentEl.value = el
      },
      close: () => machine.value?.close(),
    })

    return () => slots.default?.()
  },
})

export const PopoverTrigger = defineComponent({
  name: 'FcPopoverTrigger',
  inheritAttrs: false,
  setup(_, { slots }) {
    const ctx = usePopoverContext()
    const setTriggerEl = (el: unknown) => {
      ctx.setTriggerEl(asHtmlElement(el))
    }

    return () => {
      const children = slots.default?.()
      const vnode = children?.[0] as VNode | undefined
      if (!vnode) return null

      const triggerProps = ctx.machine.value?.getTriggerProps()
      const contentProps = ctx.machine.value?.getContentProps()
      const existingOnClick = (vnode.props as { onClick?: (event: Event) => void } | null)?.onClick

      return cloneVNode(
        vnode,
        {
          ...triggerProps,
          'aria-haspopup': 'dialog',
          'aria-expanded': triggerProps?.['aria-expanded'] ?? false,
          'aria-controls': contentProps?.id ?? triggerProps?.['aria-controls'],
          onClick: (event: Event) => {
            existingOnClick?.(event)
            ctx.machine.value?.getTriggerProps().onClick()
          },
          ref: setTriggerEl,
        },
        true,
      )
    }
  },
})

export const PopoverContent = defineComponent({
  name: 'FcPopoverContent',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const ctx = usePopoverContext()
    const setContentEl = (el: unknown) => {
      ctx.setContentEl(asHtmlElement(el))
    }

    return () => {
      const contentProps = ctx.machine.value?.getContentProps()
      const { class: className, style, ...rest } = attrs
      const incomingStyle = typeof style === 'object' && style ? { ...style } : {}
      delete (incomingStyle as { display?: string }).display

      return h(
        'div',
        {
          ...rest,
          ...contentProps,
          ref: setContentEl,
          style: incomingStyle,
          'data-state': contentProps?.['data-state'] ?? 'closed',
          'data-placement': ctx.placement.value,
          hidden: contentProps?.hidden ?? true,
          class: cx('fc-popover', className as string | undefined),
        },
        [h('span', { class: 'fc-popover__arrow', 'aria-hidden': 'true' }), slots.default?.()],
      )
    }
  },
})

export const PopoverClose = defineComponent({
  name: 'FcPopoverClose',
  inheritAttrs: false,
  setup(_, { slots }) {
    const ctx = usePopoverContext()

    return () => {
      const children = slots.default?.()
      const vnode = children?.[0] as VNode | undefined
      if (!vnode) return null
      const existingOnClick = (vnode.props as { onClick?: (event: Event) => void } | null)?.onClick

      return cloneVNode(
        vnode,
        {
          onClick: (event: Event) => {
            existingOnClick?.(event)
            ctx.close()
          },
        },
        true,
      )
    }
  },
})
