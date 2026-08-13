import { defineComponent, h, Teleport, type PropType } from 'vue'
import { createToaster, type Toast } from '@web-loom/foolscap-core'
import { useMachine } from '../composables/useMachine'
import { useSubscription } from '../composables/useSubscription'
import { provideToast, useToastContext } from '../composables/useToastContext'
import { cx } from '../utils/cx'

export { useToastContext }

export interface ToastProviderProps {
  limit?: number
  defaultDuration?: number
}

export const ToastProvider = defineComponent({
  name: 'FcToastProvider',
  inheritAttrs: false,
  props: {
    limit: { type: Number, default: undefined },
    defaultDuration: { type: Number, default: undefined },
  },
  setup(props, { slots }) {
    const machine = useMachine(() =>
      createToaster({ limit: props.limit, defaultDuration: props.defaultDuration }),
    )
    provideToast(machine)
    return () => slots.default?.()
  },
})

export interface ToasterProps {
  position?: 'top' | 'top-right' | 'bottom-right' | 'bottom'
}

export const Toaster = defineComponent({
  name: 'FcToaster',
  inheritAttrs: false,
  props: {
    position: { type: String as PropType<ToasterProps['position']>, default: 'bottom-right' },
  },
  setup(props, { attrs }) {
    const machine = useToastContext()
    useSubscription(machine)

    return () => {
      const region = h(
        'div',
        {
          ...machine.getRegionProps(),
          class: cx(
            'fc-toast-region',
            `fc-toast-region--${props.position}`,
            attrs.class as string | undefined,
          ),
        },
        machine.state.toasts.map((toast) => h(ToastItem, { key: toast.id, toast })),
      )

      if (typeof document === 'undefined') return region
      return h(Teleport, { to: 'body' }, [region])
    }
  },
})

export interface ToastItemProps {
  toast: Toast
}

export const ToastItem = defineComponent({
  name: 'FcToastItem',
  inheritAttrs: false,
  props: {
    toast: { type: Object as PropType<Toast>, required: true },
  },
  setup(props, { attrs }) {
    const machine = useToastContext()

    return () => {
      const toast = props.toast
      return h(
        'div',
        {
          ...machine.getToastProps(toast.id),
          'data-type': toast.type,
          class: cx('fc-toast', attrs.class as string | undefined),
        },
        [
          h('div', { class: 'fc-toast__content' }, [
            h('p', { class: 'fc-toast__title' }, toast.title),
            toast.description ? h('p', { class: 'fc-toast__description' }, toast.description) : null,
          ].filter((node) => node != null)),
          toast.action
            ? h(
                'button',
                { type: 'button', class: 'fc-toast__action', onClick: toast.action.onClick },
                toast.action.label,
              )
            : null,
          h('button', {
            ...machine.getDismissButtonProps(toast.id),
            type: 'button',
            class: 'fc-toast__dismiss',
          }),
        ].filter((node) => node != null),
      )
    }
  },
})
