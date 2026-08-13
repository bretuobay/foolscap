import { defineComponent, h } from 'vue'
import { cx } from '../utils/cx'

export const VisuallyHidden = defineComponent({
  name: 'FcVisuallyHidden',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'span',
        {
          ...attrs,
          class: cx('fc-visually-hidden', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})
