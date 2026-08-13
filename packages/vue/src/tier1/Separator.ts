import { defineComponent, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}

export const Separator = defineComponent({
  name: 'FcSeparator',
  inheritAttrs: false,
  props: {
    orientation: { type: String as PropType<SeparatorProps['orientation']>, default: 'horizontal' },
    decorative: { type: Boolean, default: true },
  },
  setup(props, { attrs }) {
    return () =>
      h('div', {
        ...attrs,
        role: props.decorative ? 'presentation' : 'separator',
        'aria-orientation': props.decorative ? undefined : props.orientation,
        'data-orientation': props.orientation === 'vertical' ? 'vertical' : undefined,
        class: cx('fc-separator', attrs.class as string | undefined),
      })
  },
})
