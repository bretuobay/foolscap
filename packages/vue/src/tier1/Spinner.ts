import { defineComponent, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export const Spinner = defineComponent({
  name: 'FcSpinner',
  inheritAttrs: false,
  props: {
    size: { type: String as PropType<SpinnerProps['size']>, default: 'md' },
    label: { type: String, default: 'Loading' },
  },
  setup(props, { attrs }) {
    return () =>
      h('span', {
        ...attrs,
        role: 'status',
        'data-size': props.size,
        'aria-label': props.label,
        class: cx('fc-spinner', attrs.class as string | undefined),
      })
  },
})
