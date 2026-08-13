import { defineComponent, getCurrentInstance, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error'
  live?: 'assertive' | 'polite'
  title?: string
  description?: string
  dismissLabel?: string
}

export const Alert = defineComponent({
  name: 'FcAlert',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<AlertProps['variant']>, default: 'info' },
    live: { type: String as PropType<AlertProps['live']>, default: 'assertive' },
    title: { type: String, default: undefined },
    description: { type: String, default: undefined },
    dismissLabel: { type: String, default: 'Dismiss alert' },
  },
  emits: ['dismiss'],
  setup(props, { slots, attrs, emit }) {
    const instance = getCurrentInstance()
    return () => {
      const titleContent = slots.title?.() ?? (props.title ? [props.title] : null)
      const descriptionContent = slots.description?.() ?? (props.description ? [props.description] : null)
      const hasDismiss = typeof instance?.vnode.props?.onDismiss === 'function'

      return h(
        'div',
        {
          ...attrs,
          role: (attrs.role as string | undefined) ?? (props.live === 'polite' ? 'status' : 'alert'),
          'data-variant': props.variant,
          'data-live': props.live,
          class: cx('fc-alert', attrs.class as string | undefined),
        },
        [
          slots.icon ? h('span', { class: 'fc-alert__icon', 'aria-hidden': 'true' }, slots.icon()) : null,
          h('div', { class: 'fc-alert__body' }, [
            titleContent ? h('p', { class: 'fc-alert__title' }, titleContent) : null,
            descriptionContent
              ? h('p', { class: 'fc-alert__description' }, descriptionContent)
              : (slots.default?.() ?? null),
          ]),
          hasDismiss
            ? h(
                'button',
                {
                  class: 'fc-alert__dismiss',
                  type: 'button',
                  'aria-label': props.dismissLabel,
                  onClick: () => emit('dismiss'),
                },
                'x',
              )
            : null,
        ].filter((node) => node != null),
      )
    }
  },
})
