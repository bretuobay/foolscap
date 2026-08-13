import { defineComponent, h } from 'vue'
import { cx } from '../utils/cx'

export const Link = defineComponent({
  name: 'FcLink',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'a',
        {
          ...attrs,
          class: cx('fc-link', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})
