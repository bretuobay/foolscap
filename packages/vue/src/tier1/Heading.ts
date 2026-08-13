import { defineComponent, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface HeadingProps {
  level?: HeadingLevel
}

export const Heading = defineComponent({
  name: 'FcHeading',
  inheritAttrs: false,
  props: {
    level: { type: Number as PropType<HeadingLevel>, default: 2 },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        `h${props.level}`,
        {
          ...attrs,
          'data-level': props.level,
          class: cx('fc-heading', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})
