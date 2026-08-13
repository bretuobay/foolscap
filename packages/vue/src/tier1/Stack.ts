import { defineComponent, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface StackProps {
  gap?: '1' | '2' | '3' | '4' | '6' | '8' | '12'
  align?: 'start' | 'center' | 'end' | 'stretch'
}

export const Stack = defineComponent({
  name: 'FcStack',
  inheritAttrs: false,
  props: {
    gap: { type: String as PropType<StackProps['gap']>, default: '4' },
    align: { type: String as PropType<StackProps['align']>, default: undefined },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-gap': props.gap,
          'data-align': props.align,
          class: cx('fc-stack', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})
