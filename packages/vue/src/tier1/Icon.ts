import { defineComponent, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface IconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  label?: string
}

export const Icon = defineComponent({
  name: 'FcIcon',
  inheritAttrs: false,
  props: {
    size: { type: String as PropType<IconProps['size']>, default: 'md' },
    label: { type: String, default: undefined },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'span',
        {
          ...attrs,
          'data-size': props.size,
          role: props.label ? 'img' : undefined,
          'aria-label': props.label,
          'aria-hidden': props.label ? undefined : true,
          class: cx('fc-icon', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})
