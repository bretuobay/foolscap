import { defineComponent, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface SkeletonProps {
  variant?: 'block' | 'text' | 'circle'
}

export const Skeleton = defineComponent({
  name: 'FcSkeleton',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<SkeletonProps['variant']>, default: 'block' },
  },
  setup(props, { attrs }) {
    return () =>
      h('span', {
        ...attrs,
        'aria-hidden': 'true',
        'data-variant': props.variant === 'block' ? undefined : props.variant,
        class: cx('fc-skeleton', attrs.class as string | undefined),
      })
  },
})
