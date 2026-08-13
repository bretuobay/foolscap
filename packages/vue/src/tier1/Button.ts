import { defineComponent, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
}

export const Button = defineComponent({
  name: 'FcButton',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<ButtonProps['variant']>, default: 'primary' },
    size: { type: String as PropType<ButtonProps['size']>, default: 'md' },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          type: (attrs.type as string | undefined) ?? 'button',
          'data-variant': props.variant,
          'data-size': props.size,
          'data-state': props.loading ? 'loading' : undefined,
          'aria-disabled': props.loading || props.disabled || undefined,
          disabled: props.disabled,
          class: cx('fc-button', attrs.class as string | undefined),
        },
        [
          slots.iconStart
            ? h('span', { class: 'fc-button__icon-start', 'aria-hidden': 'true' }, slots.iconStart())
            : null,
          h('span', { class: 'fc-button__label' }, slots.default?.()),
          slots.iconEnd
            ? h('span', { class: 'fc-button__icon-end', 'aria-hidden': 'true' }, slots.iconEnd())
            : null,
        ].filter((node) => node != null),
      )
  },
})
