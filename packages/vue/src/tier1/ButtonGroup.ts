import { defineComponent, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface ButtonGroupProps {
  orientation?: 'horizontal' | 'vertical'
}

export const ButtonGroup = defineComponent({
  name: 'FcButtonGroup',
  inheritAttrs: false,
  props: {
    orientation: { type: String as PropType<ButtonGroupProps['orientation']>, default: 'horizontal' },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          role: (attrs.role as string | undefined) ?? 'group',
          'data-orientation': props.orientation === 'vertical' ? 'vertical' : undefined,
          class: cx('fc-button-group', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})
