import {
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowRef,
  Teleport,
  triggerRef,
  useId,
  watch,
  type InjectionKey,
  type PropType,
} from 'vue'
import { createDrawer, type Drawer as DrawerMachine, type DrawerSide } from '@web-loom/foolscap-core'
import { cx } from '../utils/cx'

export type { DrawerSide }

interface DrawerContextValue {
  close: () => void
  registerTitleId: (id?: string) => void
}

const DrawerKey: InjectionKey<DrawerContextValue> = Symbol('fc-drawer')

function useDrawerContext(): DrawerContextValue {
  const ctx = inject(DrawerKey, null)
  if (!ctx) throw new Error('Drawer slot components must be used inside <Drawer>')
  return ctx
}

export interface DrawerProps {
  open: boolean
  side?: DrawerSide
  size?: 'sm' | 'md' | 'lg'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  animationDuration?: number
}

export interface DrawerTitleProps {
  id?: string
}

export const Drawer = defineComponent({
  name: 'FcDrawer',
  inheritAttrs: false,
  props: {
    open: { type: Boolean, required: true },
    side: { type: String as PropType<DrawerSide>, default: 'right' },
    size: { type: String as PropType<DrawerProps['size']>, default: undefined },
    closeOnOverlayClick: { type: Boolean, default: true },
    closeOnEscape: { type: Boolean, default: true },
    animationDuration: { type: Number, default: 250 },
  },
  emits: ['openChange'],
  setup(props, { slots, attrs, emit }) {
    const panelEl = ref<HTMLDialogElement | null>(null)
    const machine = shallowRef<DrawerMachine | null>(null)
    const labelledBy = ref<string | undefined>()
    let unsubscribe: (() => void) | undefined

    onMounted(() => {
      const el = panelEl.value
      if (!el) return

      const instance = createDrawer(el, {
        side: props.side,
        closeOnOverlayClick: props.closeOnOverlayClick,
        closeOnEscape: props.closeOnEscape,
        animationDuration: props.animationDuration,
        onClose: () => emit('openChange', false),
      })
      machine.value = instance
      unsubscribe = instance.subscribe(() => triggerRef(machine))
      if (props.open) instance.open()
    })

    watch(
      () => props.open,
      (open) => {
        const instance = machine.value
        if (!instance) return
        if (open) instance.open()
        else instance.close()
      },
    )

    onBeforeUnmount(() => {
      unsubscribe?.()
      machine.value?.destroy()
      machine.value = null
    })

    provide(DrawerKey, {
      close: () => machine.value?.close(),
      registerTitleId: (id) => {
        labelledBy.value = id
      },
    })

    return () => {
      const { class: className, ...rest } = attrs
      const state = machine.value?.state ?? { status: 'closed' as const, side: props.side }
      const panelProps = machine.value?.getPanelProps()
      const overlayProps = machine.value?.getOverlayProps()

      const root = h(
        'div',
        {
          ...rest,
          class: cx('fc-drawer', className as string | undefined),
          'data-state': state.status,
          'data-side': props.side,
          'data-size': props.size,
        },
        [
          h('div', {
            class: 'fc-drawer__overlay',
            'aria-hidden': 'true',
            onClick: overlayProps?.onClick,
          }),
          h(
            'dialog',
            {
              ref: panelEl,
              class: 'fc-drawer__panel',
              'aria-modal': true,
              'aria-labelledby': labelledBy.value,
              onTransitionEnd: (event: TransitionEvent) => {
                if (event.target === panelEl.value) {
                  panelProps?.onTransitionEnd(event.propertyName)
                }
              },
            },
            slots.default?.(),
          ),
        ],
      )

      if (typeof document === 'undefined') return root
      return h(Teleport, { to: 'body' }, [root])
    }
  },
})

export const DrawerHeader = defineComponent({
  name: 'FcDrawerHeader',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: cx('fc-drawer__header', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const DrawerTitle = defineComponent({
  name: 'FcDrawerTitle',
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
  },
  setup(props, { slots, attrs }) {
    const { registerTitleId } = useDrawerContext()
    const generatedId = props.id ?? `fc-drawer-title-${useId().replace(/:/g, '')}`

    onMounted(() => registerTitleId(generatedId))
    onBeforeUnmount(() => registerTitleId(undefined))

    return () =>
      h(
        'h2',
        {
          ...attrs,
          id: generatedId,
          class: cx('fc-drawer__title', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const DrawerClose = defineComponent({
  name: 'FcDrawerClose',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const { close } = useDrawerContext()
    const { onClick, ...rest } = attrs

    return () =>
      h(
        'button',
        {
          ...rest,
          type: 'button',
          'aria-label': (rest['aria-label'] as string | undefined) ?? 'Close drawer',
          class: cx('fc-drawer__close', rest.class as string | undefined),
          onClick: (event: Event) => {
            close()
            if (typeof onClick === 'function') onClick(event)
          },
        },
        slots.default?.() ?? '✕',
      )
  },
})

export const DrawerBody = defineComponent({
  name: 'FcDrawerBody',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: cx('fc-drawer__body', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const DrawerFooter = defineComponent({
  name: 'FcDrawerFooter',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: cx('fc-drawer__footer', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})
