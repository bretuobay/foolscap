import { defineComponent, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface ListProps {
  variant?: 'bulleted' | 'numbered' | 'plain'
}

export const List = defineComponent({
  name: 'FcList',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<ListProps['variant']>, default: 'bulleted' },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        props.variant === 'numbered' ? 'ol' : 'ul',
        {
          ...attrs,
          'data-variant': props.variant,
          class: cx('fc-list', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})
