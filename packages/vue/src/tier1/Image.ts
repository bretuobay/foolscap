import { defineComponent, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface ImageProps {
  variant?: 'default' | 'rounded' | 'circle' | 'bordered' | 'shadow'
}

export const Image = defineComponent({
  name: 'FcImage',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<ImageProps['variant']>, default: 'default' },
  },
  setup(props, { attrs }) {
    return () =>
      h('img', {
        ...attrs,
        'data-variant': props.variant === 'default' ? undefined : props.variant,
        class: cx('fc-image', attrs.class as string | undefined),
      })
  },
})
