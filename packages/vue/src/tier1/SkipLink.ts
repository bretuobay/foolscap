import { defineComponent, h } from 'vue'
import { cx } from '../utils/cx'

export const SkipLink = defineComponent({
  name: 'FcSkipLink',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'a',
        {
          ...attrs,
          class: cx('fc-skip-link', attrs.class as string | undefined),
        },
        slots.default?.() ?? ['Skip to main content'],
      )
  },
})
