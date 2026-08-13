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
import { createModal, type Modal as ModalMachine } from '@web-loom/foolscap-core'
import { cx } from '../utils/cx'

interface ModalContextValue {
  close: () => void
  registerTitleId: (id?: string) => void
  registerBodyId: (id?: string) => void
}

const ModalKey: InjectionKey<ModalContextValue> = Symbol('fc-modal')

function useModalContext(): ModalContextValue {
  const ctx = inject(ModalKey, null)
  if (!ctx) throw new Error('Modal slot components must be used inside <Modal>')
  return ctx
}

export interface ModalProps {
  open: boolean
  variant?: 'default' | 'alert'
  size?: 'sm' | 'md' | 'lg' | 'full'
  closeOnBackdropClick?: boolean
  animationDuration?: number
}

export interface ModalTitleProps {
  id?: string
}

export interface ModalBodyProps {
  id?: string
}

export const Modal = defineComponent({
  name: 'FcModal',
  inheritAttrs: false,
  props: {
    open: { type: Boolean, required: true },
    variant: { type: String as PropType<ModalProps['variant']>, default: 'default' },
    size: { type: String as PropType<ModalProps['size']>, default: 'md' },
    closeOnBackdropClick: { type: Boolean, default: true },
    animationDuration: { type: Number, default: 200 },
  },
  emits: ['close'],
  setup(props, { slots, attrs, emit }) {
    const dialogEl = ref<HTMLDialogElement | null>(null)
    const machine = shallowRef<ModalMachine | null>(null)
    const labelledBy = ref<string | undefined>()
    const describedBy = ref<string | undefined>()
    let unsubscribe: (() => void) | undefined

    onMounted(() => {
      const el = dialogEl.value
      if (!el) return

      const instance = createModal(el, {
        closeOnBackdropClick: props.closeOnBackdropClick,
        animationDuration: props.animationDuration,
        onClose: () => emit('close'),
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

    provide(ModalKey, {
      close: () => machine.value?.close(),
      registerTitleId: (id) => {
        labelledBy.value = id
      },
      registerBodyId: (id) => {
        describedBy.value = id
      },
    })

    return () => {
      const { class: className, onAnimationEnd, ...rest } = attrs
      const rootProps = machine.value?.getRootProps()
      const dialogOpen = dialogEl.value?.open ?? false

      const dialog = h(
        'dialog',
        {
          ...rest,
          ref: dialogEl,
          'aria-modal': true,
          'aria-labelledby': labelledBy.value,
          'aria-describedby': props.variant === 'alert' ? describedBy.value : undefined,
          role: props.variant === 'alert' ? 'alertdialog' : 'dialog',
          'data-state': dialogOpen ? 'open' : 'closed',
          'data-variant': props.variant,
          'data-size': props.size,
          onAnimationEnd: (event: Event) => {
            if (typeof onAnimationEnd === 'function') onAnimationEnd(event)
            rootProps?.onAnimationEnd()
          },
          class: cx(
            'fc-modal',
            props.variant !== 'default' && `fc-modal--${props.variant}`,
            props.size !== 'md' && `fc-modal--${props.size}`,
            className as string | undefined,
          ),
        },
        slots.default?.(),
      )

      if (typeof document === 'undefined') return dialog
      return h(Teleport, { to: 'body' }, [dialog])
    }
  },
})

export const ModalHeader = defineComponent({
  name: 'FcModalHeader',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: cx('fc-modal__header', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const ModalTitle = defineComponent({
  name: 'FcModalTitle',
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
  },
  setup(props, { slots, attrs }) {
    const { registerTitleId } = useModalContext()
    const generatedId = props.id ?? `fc-modal-title-${useId().replace(/:/g, '')}`

    onMounted(() => registerTitleId(generatedId))
    onBeforeUnmount(() => registerTitleId(undefined))

    return () =>
      h(
        'h2',
        {
          ...attrs,
          id: generatedId,
          class: cx('fc-modal__title', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const ModalBody = defineComponent({
  name: 'FcModalBody',
  inheritAttrs: false,
  props: {
    id: { type: String, default: undefined },
  },
  setup(props, { slots, attrs }) {
    const { registerBodyId } = useModalContext()
    const generatedId = props.id ?? `fc-modal-body-${useId().replace(/:/g, '')}`

    onMounted(() => registerBodyId(generatedId))
    onBeforeUnmount(() => registerBodyId(undefined))

    return () =>
      h(
        'div',
        {
          ...attrs,
          id: generatedId,
          class: cx('fc-modal__body', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const ModalFooter = defineComponent({
  name: 'FcModalFooter',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: cx('fc-modal__footer', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})

export const ModalClose = defineComponent({
  name: 'FcModalClose',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const { close } = useModalContext()
    const { onClick, ...rest } = attrs

    return () =>
      h(
        'button',
        {
          ...rest,
          type: 'button',
          'aria-label': (rest['aria-label'] as string | undefined) ?? 'Close modal',
          class: cx('fc-modal__close', rest.class as string | undefined),
          onClick: (event: Event) => {
            close()
            if (typeof onClick === 'function') onClick(event)
          },
        },
        slots.default?.(),
      )
  },
})
