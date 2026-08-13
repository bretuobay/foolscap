import { defineComponent, h } from 'vue'
import { cx } from '../utils/cx'

export interface LabelProps {
  required?: boolean
}

export const Label = defineComponent({
  name: 'FcLabel',
  inheritAttrs: false,
  props: {
    required: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'label',
        {
          ...attrs,
          'data-required': props.required ? 'true' : undefined,
          class: cx('fc-label', attrs.class as string | undefined),
        },
        slots.default?.(),
      )
  },
})
