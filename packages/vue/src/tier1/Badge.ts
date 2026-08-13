import { defineComponent, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface BadgeProps {
  variant?: 'default' | 'outline' | 'subtle'
}

export const Badge = defineComponent({
  name: 'FcBadge',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<BadgeProps['variant']>, default: 'default' },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'span',
        {
          ...attrs,
          'data-variant': props.variant === 'default' ? undefined : props.variant,
          class: cx('fc-badge', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})
