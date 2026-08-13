import { defineComponent, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface TableProps {
  variant?: 'default' | 'striped' | 'bordered'
}

export const Table = defineComponent({
  name: 'FcTable',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<TableProps['variant']>, default: 'default' },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'table',
        {
          ...attrs,
          'data-variant': props.variant === 'default' ? undefined : props.variant,
          class: cx('fc-table', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})
